import { generateObject } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { NextResponse } from "next/server";
import { z } from "zod";
import { FRAMEWORKS, SCHEMAS, type FrameworkId } from "@/frameworks";

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
    const schema = SCHEMAS[id];
    const generation = await generateObject({
      model,
      schema,
      system: GENERATOR_SYSTEM,
      prompt: `Decision:\n\n"${decisionText}"\n\nFramework: ${meta.name} (id: "${id}", category: "${meta.category}")\nWhy this fits: ${selection.object.reason}\n\nGenerate the structured analysis now. Make sure the "framework" field equals "${id}" and "category" equals "${meta.category}".`,
      maxOutputTokens: 2400,
    });

    return NextResponse.json(generation.object);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/analyze] failed:", message, err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
