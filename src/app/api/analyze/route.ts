import { generateObject, generateText, NoObjectGeneratedError } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { NextResponse } from "next/server";
import { FRAMEWORKS, SAMPLES, SCHEMAS, type FrameworkId } from "@/frameworks";
import { buildError } from "@/lib/errors";

const apiKey = process.env["ANTHROPIC_API_KEY"] ?? process.env["AI_GATEWAY_API_KEY"];
const anthropic = createAnthropic(apiKey ? { apiKey } : {});

export const maxDuration = 60;

const NUM_ALTERNATIVES = 3;

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
  return `You are a decision-framework librarian. Pick the single most appropriate framework id for the user's decision, then ${NUM_ALTERNATIVES} distinct alternative frameworks that would also be useful — diverse in approach, not minor variants of the top pick.

Do NOT default to "decision_matrix" — only choose it when the user is genuinely comparing 2+ named alternatives across multiple weighted criteria. Most decisions fit a more specific framework. Examples:
- "Why does X take so long?" → first_principles or five_whys
- "Imagine the launch failed, why?" → pre_mortem
- "Salary negotiation walkaway?" → batna
- "Which feature ships next?" → rice
- "Take the moonshot or the safe job?" → regret_min (not decision_matrix)
- "Should I quit my PhD?" → sunk_cost
- "How do I think about this layoff?" → stoic
- "Why did production go down?" → five_whys
- "Pick a city / job offer / tool with criteria" → decision_matrix

Frameworks, by category:
${lines.join("\n")}`;
}

const SELECTOR_SYSTEM = buildSelectorPrompt();

const GENERATOR_SYSTEM = `You are an expert decision-analysis tool. Generate realistic, insightful data that fully populates the framework's schema based on what the user wrote.

- Set "category" to the framework's category string (provided in the prompt).
- Set "title" to a short summary of the user's decision.
- Set "framework" to the exact id provided.
- Write "recommendation" as a calm, second-person note — like a thoughtful older friend. Two short paragraphs, ~90-130 words. No bullet points, no headings, no exclamation marks, no emoji. Do not use the word "framework". Begin the first paragraph with a strong opening word (it will get a drop cap).`;

// Map an underlying error to a more specific error key when we can recognise it.
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

type Pick = { id: FrameworkId; reason: string };

function parseSelectorOutput(text: string, validIds: ReadonlySet<string>): Pick[] {
  const picks: Pick[] = [];
  const seen = new Set<string>();
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    // Accept "id | reason", "id - reason", "id: reason", "id"
    const m = line.match(/^([a-z0-9_]+)\s*(?:[|\-:—]\s*(.*))?$/i);
    if (!m) continue;
    const candidate = (m[1] ?? "").toLowerCase();
    if (!validIds.has(candidate)) continue;
    if (seen.has(candidate)) continue;
    seen.add(candidate);
    picks.push({ id: candidate as FrameworkId, reason: (m[2] ?? "").trim() || "another useful angle on this decision" });
  }
  return picks;
}

export async function POST(req: Request) {
  const body = await req.json() as {
    decisionText?: string;
    frameworkId?: string;
  };
  const { decisionText, frameworkId } = body;
  if (!decisionText || typeof decisionText !== "string") {
    return NextResponse.json(buildError("INVALID_INPUT", "decisionText missing"), { status: 400 });
  }
  if (!apiKey) {
    console.error("[/api/analyze] no ANTHROPIC_API_KEY or AI_GATEWAY_API_KEY set in env");
    return NextResponse.json(buildError("NO_API_KEY", "missing env: ANTHROPIC_API_KEY or AI_GATEWAY_API_KEY"), { status: 500 });
  }

  // Haiku 4.5 is fast and reliable for structured output. Sonnet 4.6's extended
  // thinking eats output budget and frequently truncates the JSON before zod
  // can parse it.
  const model = anthropic("claude-haiku-4-5");
  const allIds = FRAMEWORKS.map((f) => f.id) as FrameworkId[];
  const validIdSet = new Set<string>(allIds);

  let primary: Pick;
  let alternatives: { id: FrameworkId; name: string; reason: string }[] = [];

  // Caller-specified framework — skip selection entirely.
  if (typeof frameworkId === "string" && validIdSet.has(frameworkId)) {
    primary = { id: frameworkId as FrameworkId, reason: "selected by the user" };
  } else {
    // Stage 1 — pick a primary + alternatives. Plain text generation +
    // manual validation is more reliable than generateObject with a 60+ enum.
    try {
      const result = await generateText({
        model,
        system: SELECTOR_SYSTEM,
        prompt: `Decision:\n\n"${decisionText}"\n\nReply with exactly ${1 + NUM_ALTERNATIVES} lines, one framework per line, in order from best fit to alternative. Each line is "framework_id | one-sentence reason". The first line is the primary recommendation; the next ${NUM_ALTERNATIVES} are diverse alternatives. No JSON, no markdown, no headers, no other text. Example output:\n\nfirst_principles | The user is questioning a deeply-held assumption.\nfive_whys | Useful to drill into root causes.\npre_mortem | Helps imagine failure modes up front.\ninversion | Flips the question to clarify the goal.`,
        maxOutputTokens: 600,
      });
      const picks = parseSelectorOutput(result.text, validIdSet);
      if (picks.length === 0) {
        console.error("[/api/analyze] stage-1 returned no valid ids, raw:", result.text);
        return NextResponse.json(
          buildError("UNKNOWN_FRAMEWORK", `selector returned: ${result.text.slice(0, 200)}`),
          { status: 502 },
        );
      }
      primary = picks[0]!;
      alternatives = picks.slice(1, 1 + NUM_ALTERNATIVES).map((p) => {
        const m = FRAMEWORKS.find((f) => f.id === p.id)!;
        return { id: p.id, name: m.name, reason: p.reason };
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("[/api/analyze] stage-1 failed:", message, err);
      const { key, status } = classify(err);
      const code = key === "UNKNOWN" ? "SELECTOR_FAILED" : key;
      return NextResponse.json(buildError(code, message), { status });
    }
  }

  const id = primary.id;
  const meta = FRAMEWORKS.find((f) => f.id === id);
  if (!meta) {
    console.error("[/api/analyze] unknown framework:", id);
    return NextResponse.json(buildError("UNKNOWN_FRAMEWORK", `id=${id}`), { status: 500 });
  }

  try {
    // Stage 2 — generate the framework data against that single specific schema.
    // Including the sample as a worked example dramatically improves schema
    // compliance for the trickier frameworks (records with enum keys, fixed
    // tuple lengths, numeric ranges, etc.).
    const schema = SCHEMAS[id];
    const sample = SAMPLES[id];
    const sampleJson = JSON.stringify(sample, null, 2);

    const stage2Prompt = (extraGuidance = "") =>
      `Decision:\n\n"${decisionText}"\n\nFramework: ${meta.name} (id: "${id}", category: "${meta.category}")\nWhy this fits: ${primary.reason}\n\nHere is a worked example of a VALID response in this exact schema (different decision, same shape — match this structure precisely):\n\n${sampleJson}\n\nNow produce the structured analysis for the user's decision. The "framework" field MUST equal "${id}" and "category" MUST equal "${meta.category}". Match the example's shape exactly: same keys, same array lengths where the schema requires fixed lengths, same value ranges. Replace the example's contents with insightful, specific content drawn from the user's decision.${extraGuidance}`;

    // Stage 2 — up to 3 attempts. No fallback: if all 3 fail, error out.
    const MAX_ATTEMPTS = 3;
    const errors: string[] = [];
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const extra = attempt === 1
        ? ""
        : `\n\nIMPORTANT: previous attempt(s) did NOT match the schema (${errors.join(" | ")}). Be extra careful with array lengths, numeric ranges, required keys, and the exact shape of each field. Copy the example's structure precisely.`;
      try {
        const generated = await generateObject({
          model,
          schema,
          system: GENERATOR_SYSTEM,
          prompt: stage2Prompt(extra),
          maxOutputTokens: 8000,
        });
        return NextResponse.json({ ...(generated.object as object), altFrameworks: alternatives });
      } catch (err) {
        // Surface raw model output + finish reason so we can see what failed.
        let detail = err instanceof Error ? err.message : "Unknown error";
        if (NoObjectGeneratedError.isInstance(err)) {
          detail = `NoObjectGenerated finishReason=${err.finishReason} cause=${err.cause instanceof Error ? err.cause.message : String(err.cause)} text=${(err.text ?? "").slice(0, 500)}`;
          console.warn(`[/api/analyze] stage-2 attempt ${attempt} raw text:`, err.text);
        }
        errors.push(`attempt ${attempt}: ${detail}`);
        console.warn(`[/api/analyze] stage-2 attempt ${attempt}/${MAX_ATTEMPTS} failed:`, detail);
      }
    }

    // All retries exhausted — surface the failure with a code.
    console.error("[/api/analyze] stage-2 exhausted all retries:", errors.join(" || "));
    const last = errors[errors.length - 1] ?? "unknown";
    const code = last.includes("finishReason=length") ? "TRUNCATED" : "SCHEMA_FAIL";
    return NextResponse.json(buildError(code, `${meta.name} | ${last}`), { status: 502 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/analyze] stage-2 unexpected throw:", message, err);
    const { key, status } = classify(err);
    return NextResponse.json(buildError(key, message), { status });
  }
}
