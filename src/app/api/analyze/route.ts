import { generateObject, generateText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { NextResponse } from "next/server";
import { z } from "zod";
import { FRAMEWORKS, SAMPLES, SCHEMAS, type FrameworkId } from "@/frameworks";

const apiKey = process.env["ANTHROPIC_API_KEY"] ?? process.env["AI_GATEWAY_API_KEY"];
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

export async function POST(req: Request) {
  const { decisionText } = await req.json() as { decisionText?: string };
  if (!decisionText || typeof decisionText !== "string") {
    return NextResponse.json({ error: "decisionText is required" }, { status: 400 });
  }

  const model = anthropic("claude-sonnet-4-6");
  const ids = FRAMEWORKS.map((f) => f.id) as [FrameworkId, ...FrameworkId[]];

  try {
    // Stage 1 — pick a framework id from the small enum.
    const selectorSchema = z.object({
      framework: z.enum(ids),
      reason: z.string().describe("One sentence on why this framework fits"),
    });
    const selection = await generateObject({
      model,
      schema: selectorSchema,
      system: SELECTOR_SYSTEM,
      prompt: `Decision:\n\n"${decisionText}"\n\nReturn the best-fit framework id.`,
      maxOutputTokens: 200,
    });
    const id = selection.object.framework;
    const meta = FRAMEWORKS.find((f) => f.id === id);
    if (!meta) {
      return NextResponse.json({ error: `Unknown framework: ${id}` }, { status: 500 });
    }

    // Stage 2 — generate the framework data against that single specific schema.
    // Including the sample as a worked example dramatically improves schema
    // compliance for the trickier frameworks (records with enum keys, fixed
    // tuple lengths, numeric ranges, etc.).
    const schema = SCHEMAS[id];
    const sample = SAMPLES[id];
    const sampleJson = JSON.stringify(sample, null, 2);

    const stage2Prompt = (extraGuidance = "") =>
      `Decision:\n\n"${decisionText}"\n\nFramework: ${meta.name} (id: "${id}", category: "${meta.category}")\nWhy this fits: ${selection.object.reason}\n\nHere is a worked example of a VALID response in this exact schema (different decision, same shape — match this structure precisely):\n\n${sampleJson}\n\nNow produce the structured analysis for the user's decision. The "framework" field MUST equal "${id}" and "category" MUST equal "${meta.category}". Match the example's shape exactly: same keys, same array lengths where the schema requires fixed lengths, same value ranges. Replace the example's contents with insightful, specific content drawn from the user's decision.${extraGuidance}`;

    let generated;
    try {
      generated = await generateObject({
        model,
        schema,
        system: GENERATOR_SYSTEM,
        prompt: stage2Prompt(),
        maxOutputTokens: 2400,
      });
    } catch (err1) {
      console.warn("[/api/analyze] stage-2 attempt 1 failed, retrying:", err1 instanceof Error ? err1.message : err1);
      try {
        generated = await generateObject({
          model,
          schema,
          system: GENERATOR_SYSTEM,
          prompt: stage2Prompt("\n\nIMPORTANT: your previous attempt did NOT match the schema. Be extra careful with array lengths, numeric ranges, required keys, and the exact shape of each field. Copy the example's structure precisely."),
          maxOutputTokens: 2400,
        });
      } catch (err2) {
        // Both attempts failed — fall back to the sample with overrides so the
        // user always sees something valid and editable.
        console.error("[/api/analyze] stage-2 both attempts failed, falling back to sample:", err2 instanceof Error ? err2.message : err2);
        let recommendation = sample.recommendation;
        try {
          const noteResult = await generateText({
            model,
            system: GENERATOR_SYSTEM,
            prompt: `Decision:\n\n"${decisionText}"\n\nWrite a short two-paragraph recommendation now. About 90-130 words total. No bullet points, no headings, no exclamation marks. Begin the first paragraph with a strong opening word.`,
            maxOutputTokens: 400,
          });
          if (noteResult.text.trim()) recommendation = noteResult.text.trim();
        } catch (err3) {
          console.warn("[/api/analyze] recommendation fallback failed:", err3);
        }
        const fallback = {
          ...sample,
          title: decisionText.slice(0, 120),
          recommendation,
        };
        return NextResponse.json(fallback);
      }
    }

    return NextResponse.json(generated.object);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/analyze] failed:", message, err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
