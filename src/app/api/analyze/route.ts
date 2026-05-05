import { generateObject } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { NextResponse } from "next/server";
import { z } from "zod";

const apiKey = process.env["ANTHROPIC_API_KEY"] ?? process.env["AI_GATEWAY_API_KEY"];
const anthropic = createAnthropic(apiKey ? { apiKey } : {});

export const maxDuration = 60;

const matrixSchema = z.object({
  framework: z.literal("decision_matrix"),
  title: z.string(),
  criteria: z.array(z.object({ name: z.string(), weight: z.number().min(1).max(10) })).min(2).max(6),
  options: z.array(z.object({ name: z.string(), scores: z.array(z.number().min(0).max(10)) })).min(2).max(6),
  recommendation: z.string(),
});

const costBenefitSchema = z.object({
  framework: z.literal("cost_benefit"),
  title: z.string(),
  benefits: z.array(z.object({ text: z.string(), weight: z.number().min(1).max(9) })).min(1).max(8),
  costs: z.array(z.object({ text: z.string(), weight: z.number().min(1).max(9) })).min(1).max(8),
  recommendation: z.string(),
});

const swotSchema = z.object({
  framework: z.literal("swot"),
  title: z.string(),
  strengths: z.array(z.string()).min(1).max(6),
  weaknesses: z.array(z.string()).min(1).max(6),
  opportunities: z.array(z.string()).min(1).max(6),
  threats: z.array(z.string()).min(1).max(6),
  recommendation: z.string(),
});

const analysisSchema = z.discriminatedUnion("framework", [
  matrixSchema,
  costBenefitSchema,
  swotSchema,
]);

const SYSTEM = `You are an expert decision-analysis tool. Given a decision the user is weighing, you must:
1. Choose the most appropriate framework: "decision_matrix" (comparing discrete options across multiple criteria), "cost_benefit" (weighing pros vs cons of a single course of action), or "swot" (strategic position analysis with strengths/weaknesses/opportunities/threats).
2. Generate realistic, insightful data for that framework based on what the user wrote.
3. Write an initial recommendation: a short, calm, second-person note — like a thoughtful older friend. Two short paragraphs, ~90-130 words. No bullet points, no headings, no exclamation marks, no emoji. Do not use the word "framework". Begin the first paragraph with a strong opening word (it will get a drop cap).

Choose "decision_matrix" when there are 2+ named options to compare.
Choose "cost_benefit" when evaluating whether to do one thing (a single yes/no or go/no-go).
Choose "swot" when the question is about strategic position, competitive landscape, or a venture/project.`;

export async function POST(req: Request) {
  const { decisionText } = await req.json() as { decisionText?: string };
  if (!decisionText || typeof decisionText !== "string") {
    return NextResponse.json({ error: "decisionText is required" }, { status: 400 });
  }

  try {
    const { object } = await generateObject({
      model: anthropic("claude-sonnet-4-6"),
      schema: analysisSchema,
      system: SYSTEM,
      prompt: `The user is weighing this decision:\n\n"${decisionText}"\n\nGenerate the analysis now.`,
      maxOutputTokens: 1200,
    });

    return NextResponse.json(object);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
