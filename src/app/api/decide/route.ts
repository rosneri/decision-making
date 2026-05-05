import { generateObject, generateText, NoObjectGeneratedError } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { NextResponse } from "next/server";
import { FRAMEWORKS, SAMPLES, SCHEMAS, type FrameworkId } from "@/frameworks";
import { buildError } from "@/lib/errors";

const apiKey =
  process.env["ANTHROPIC_API_KEY"] ?? process.env["AI_GATEWAY_API_KEY"];
const anthropic = createAnthropic(apiKey ? { apiKey } : {});

export const maxDuration = 60;

function buildSelectorPrompt(): string {
  const grouped = new Map<string, typeof FRAMEWORKS[number][]>();
  for (const f of FRAMEWORKS) {
    const list = grouped.get(f.category) ?? [];
    list.push(f);
    grouped.set(f.category, list);
  }
  const lines: string[] = [];
  for (const [category, items] of grouped) {
    lines.push(`\n${category}:`);
    for (const f of items) {
      lines.push(`  - "${f.id}" — ${f.blurb}`);
    }
  }
  return `You are a decision-framework librarian. Pick the SINGLE most appropriate framework id for the user's decision.

Do NOT default to "decision_matrix" — only choose it when the user is genuinely comparing 2+ named alternatives across multiple weighted criteria.

Frameworks, by category:
${lines.join("\n")}`;
}

const SELECTOR_SYSTEM = buildSelectorPrompt();

const GENERATOR_SYSTEM = `You are an expert decision-analysis tool. Generate realistic, insightful data that fully populates the framework's schema based on what the user wrote.

- Set "category" to the framework's category string (provided in the prompt).
- Set "title" to a short summary of the user's decision.
- Set "framework" to the exact id provided.
- Write "recommendation" as a calm, second-person note — like a thoughtful older friend. Two short paragraphs, ~90-130 words. No bullet points, no headings, no exclamation marks, no emoji. Do not use the word "framework". Begin the first paragraph with a strong opening word (it will get a drop cap).`;

function classify(err: unknown): { key: "AUTH" | "RATE_LIMIT" | "UPSTREAM" | "UNKNOWN"; status: number } {
  const message = err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase();
  if (message.includes("401") || message.includes("unauthorized") || message.includes("invalid api key") || message.includes("authentication")) {
    return { key: "AUTH", status: 502 };
  }
  if (message.includes("429") || message.includes("rate limit") || message.includes("too many requests")) {
    return { key: "RATE_LIMIT", status: 429 };
  }
  if (message.includes("fetch failed") || message.includes("econnrefused") || message.includes("etimedout") || message.includes("network")) {
    return { key: "UPSTREAM", status: 502 };
  }
  return { key: "UNKNOWN", status: 500 };
}

export async function POST(req: Request) {
  const { text, framework } = await req.json() as { text?: string; framework?: string };

  if (!text || typeof text !== "string") {
    return NextResponse.json(buildError("INVALID_INPUT", "text missing"), { status: 400 });
  }
  if (!apiKey) {
    console.error("[/api/decide] no ANTHROPIC_API_KEY or AI_GATEWAY_API_KEY set in env");
    return NextResponse.json(buildError("NO_API_KEY", "missing env: ANTHROPIC_API_KEY or AI_GATEWAY_API_KEY"), { status: 500 });
  }

  const model = anthropic("claude-haiku-4-5");
  const ids = FRAMEWORKS.map((f) => f.id) as [FrameworkId, ...FrameworkId[]];

  // Stage 1 — pick a framework id (or honour caller override). Plain text +
  // manual validation; a 60-element enum in structured-output mode is
  // rejected upstream.
  let id: FrameworkId;
  let reason = "best fit for the user's decision";
  if (framework && ids.includes(framework as FrameworkId)) {
    id = framework as FrameworkId;
  } else {
    try {
      const result = await generateText({
        model,
        system: SELECTOR_SYSTEM,
        prompt: `Decision:\n\n"${text}"\n\nReply with ONLY the framework id on its own line (lowercase_snake_case, exactly as listed above), then on the next line a one-sentence reason. No JSON, no markdown, no other text. Example output:\n\nfirst_principles\nThe user is questioning a deeply-held assumption.`,
        maxOutputTokens: 200,
      });
      const lines = result.text.trim().split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      const candidate = (lines[0] ?? "").toLowerCase().replace(/[^a-z0-9_]/g, "");
      if (!ids.includes(candidate as FrameworkId)) {
        console.error("[/api/decide] stage-1 returned unknown id:", candidate, "raw:", result.text);
        return NextResponse.json(
          buildError("UNKNOWN_FRAMEWORK", `selector returned: ${result.text.slice(0, 200)}`),
          { status: 502 },
        );
      }
      id = candidate as FrameworkId;
      if (lines[1]) reason = lines[1];
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("[/api/decide] stage-1 failed:", message);
      const { key, status } = classify(err);
      const code = key === "UNKNOWN" ? "SELECTOR_FAILED" : key;
      return NextResponse.json(buildError(code, message), { status });
    }
  }

  const meta = FRAMEWORKS.find((f) => f.id === id);
  if (!meta) {
    console.error("[/api/decide] unknown framework id:", id);
    return NextResponse.json(buildError("UNKNOWN_FRAMEWORK", `id=${id}`), { status: 500 });
  }

  try {
    const schema = SCHEMAS[id];
    const sample = SAMPLES[id];
    const sampleJson = JSON.stringify(sample, null, 2);

    const stage2Prompt = (extraGuidance = "") =>
      `Decision:\n\n"${text}"\n\nFramework: ${meta.name} (id: "${id}", category: "${meta.category}")\nWhy this fits: ${reason}\n\nHere is a worked example of a VALID response in this exact schema (different decision, same shape — match this structure precisely):\n\n${sampleJson}\n\nNow produce the structured analysis for the user's decision. The "framework" field MUST equal "${id}" and "category" MUST equal "${meta.category}". Match the example's shape exactly: same keys, array lengths where the schema requires fixed lengths, value ranges. Replace the example's contents with insightful, specific content drawn from the user's decision.${extraGuidance}`;

    const MAX_ATTEMPTS = 3;
    const errors: string[] = [];
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const extra = attempt === 1
        ? ""
        : `\n\nIMPORTANT: previous attempt(s) did NOT match the schema (${errors.join(" | ")}). Be extra careful with array lengths, numeric ranges, and required keys.`;
      try {
        const generated = await generateObject({
          model,
          schema,
          system: GENERATOR_SYSTEM,
          prompt: stage2Prompt(extra),
          maxOutputTokens: 8000,
        });
        return NextResponse.json({ result: generated.object });
      } catch (err) {
        let detail = err instanceof Error ? err.message : "Unknown error";
        if (NoObjectGeneratedError.isInstance(err)) {
          detail = `NoObjectGenerated finishReason=${err.finishReason} cause=${err.cause instanceof Error ? err.cause.message : String(err.cause)} text=${(err.text ?? "").slice(0, 500)}`;
        }
        errors.push(`attempt ${attempt}: ${detail}`);
        console.warn(`[/api/decide] stage-2 attempt ${attempt}/${MAX_ATTEMPTS} failed:`, detail);
      }
    }

    console.error("[/api/decide] stage-2 exhausted all retries:", errors.join(" || "));
    const last = errors[errors.length - 1] ?? "unknown";
    const code = last.includes("finishReason=length") ? "TRUNCATED" : "SCHEMA_FAIL";
    return NextResponse.json(buildError(code, `${meta.name} | ${last}`), { status: 502 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/decide] stage-2 unexpected throw:", message);
    const { key, status } = classify(err);
    return NextResponse.json(buildError(key, message), { status });
  }
}
