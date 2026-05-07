import { generateObject } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { NextResponse } from "next/server";
import { z } from "zod";
import { buildError } from "@/lib/errors";

const apiKey = process.env["ANTHROPIC_API_KEY"] ?? process.env["AI_GATEWAY_API_KEY"];
const anthropic = createAnthropic(apiKey ? { apiKey } : {});

export const maxDuration = 30;

const QuestionSchema = z.discriminatedUnion("type", [
  z.object({
    id: z.string().describe("short snake_case identifier, e.g. timeline"),
    text: z.string().describe("the question to ask the user"),
    type: z.literal("choice"),
    options: z.array(z.string()).min(2).max(6).describe("2–6 concrete answer options"),
    multiSelect: z.boolean().describe("true if more than one option may apply"),
  }),
  z.object({
    id: z.string(),
    text: z.string(),
    type: z.literal("text"),
  }),
]);

const ResponseSchema = z.discriminatedUnion("skip", [
  z.object({ skip: z.literal(true) }),
  z.object({
    skip: z.literal(false),
    questions: z.array(QuestionSchema).min(1).max(3),
  }),
]);

const SYSTEM = `You are a decision-clarification assistant. Your only job is to decide whether a decision statement has enough context for structured analysis, and if not, to ask the minimum number of targeted follow-up questions.

SKIP (return skip: true) when:
- The decision is specific and well-scoped (a clear trade-off, named alternatives, or a defined situation)
- More context would not meaningfully change the analysis
- The user is already describing a concrete situation

ASK (return skip: false, 1–3 questions) only when:
- The decision is so brief or vague that you cannot tell what domain, stakes, or constraints are involved
- One or two pieces of context would dramatically change which framework fits
- The user has given almost no information (e.g. "should I do it", "not sure what to do")

Questions must be:
- Focused on what is genuinely missing, not nice-to-have background
- Worded plainly and directly — no jargon
- choice type when there are obvious buckets (timeline, stakes, relationship); text type only when no buckets make sense
- multiSelect: true only when multiple options genuinely co-apply (e.g. stakeholders involved)

Default to skip. When in doubt, skip.`;

export async function POST(req: Request) {
  const body = await req.json() as { decisionText?: string };
  const { decisionText } = body;

  if (!decisionText || typeof decisionText !== "string" || !decisionText.trim()) {
    return NextResponse.json(buildError("INVALID_INPUT", "decisionText missing"), { status: 400 });
  }
  if (!apiKey) {
    return NextResponse.json(buildError("NO_API_KEY", "missing env: ANTHROPIC_API_KEY or AI_GATEWAY_API_KEY"), { status: 500 });
  }

  try {
    const { object } = await generateObject({
      model: anthropic("claude-haiku-4-5"),
      schema: ResponseSchema,
      system: SYSTEM,
      prompt: `Decision the user submitted:\n\n"${decisionText.trim()}"`,
      maxOutputTokens: 600,
    });
    return NextResponse.json(object);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/clarify] failed:", message);
    // On error, skip clarification so the user isn't blocked
    return NextResponse.json({ skip: true });
  }
}
