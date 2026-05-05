import { generateObject } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { NextResponse } from "next/server";
import { FRAMEWORKS, FrameworkSchema } from "@/frameworks";

const apiKey = process.env["ANTHROPIC_API_KEY"] ?? process.env["AI_GATEWAY_API_KEY"];
const anthropic = createAnthropic(apiKey ? { apiKey } : {});

export const maxDuration = 60;

function buildSystemPrompt(): string {
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
  return `You are an expert decision-analysis tool with a library of ${FRAMEWORKS.length} frameworks. Given a decision the user is weighing, you must:

1. Pick the SINGLE most appropriate framework from the list below. Do NOT default to "decision_matrix" — only choose it when the user is genuinely comparing 2+ named alternatives across multiple weighted criteria. Most decisions fit a more specific framework. Examples:
   - "Why does X take so long?" → first_principles or five_whys
   - "Imagine the launch failed, why?" → pre_mortem
   - "Salary negotiation walkaway?" → batna
   - "Which feature ships next?" → rice
   - "Take the moonshot or the safe job?" → regret_min (not decision_matrix)
   - "Should I quit my PhD?" → sunk_cost
   - "How do I think about this layoff?" → stoic
   - "Why did production go down?" → five_whys
   - "Pick a city / job offer / tool with criteria" → decision_matrix

2. Generate realistic, insightful data that fully populates the chosen framework's schema.

3. Set "category" to the exact category string of the chosen framework (e.g. "Analysis & evaluation", "Mental models", "Speed & prioritization").

4. Set "title" to a short summary of the user's decision.

5. Write "recommendation" as a calm, second-person note — like a thoughtful older friend. Two short paragraphs, ~90-130 words. No bullet points, no headings, no exclamation marks, no emoji. Do not use the word "framework". Begin the first paragraph with a strong opening word (it will get a drop cap).

The frameworks, by category:
${lines.join("\n")}`;
}

const SYSTEM = buildSystemPrompt();

export async function POST(req: Request) {
  const { decisionText } = await req.json() as { decisionText?: string };
  if (!decisionText || typeof decisionText !== "string") {
    return NextResponse.json({ error: "decisionText is required" }, { status: 400 });
  }

  try {
    const { object } = await generateObject({
      model: anthropic("claude-sonnet-4-6"),
      schema: FrameworkSchema,
      system: SYSTEM,
      prompt: `The user is weighing this decision:\n\n"${decisionText}"\n\nChoose the most fitting framework and generate the analysis now.`,
      maxOutputTokens: 2400,
    });

    return NextResponse.json(object);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
