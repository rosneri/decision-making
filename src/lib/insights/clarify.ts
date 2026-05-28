import { generateObject } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

const apiKey = process.env["ANTHROPIC_API_KEY"] ?? process.env["AI_GATEWAY_API_KEY"];
const anthropic = createAnthropic(apiKey ? { apiKey } : {});

const QuestionSchema = z.object({
  id: z.string().describe("short snake_case identifier, e.g. timeline"),
  text: z.string().describe("the question to ask the user"),
  type: z.enum(["choice", "text"]),
  options: z.array(z.string()).max(6).optional().describe("2–6 concrete options, only for choice type"),
  multiSelect: z.boolean().optional().describe("true if more than one option may apply, only for choice type"),
});

const ResponseSchema = z.object({
  needsClarification: z.boolean().describe("true if follow-up questions should be shown"),
  questions: z.array(QuestionSchema).max(3).describe("1–3 questions when needsClarification is true, empty array otherwise"),
});

const SYSTEM = `You are a decision-clarification assistant. Read the user's decision and decide whether asking 1–3 short follow-up questions would meaningfully improve the analysis.

Ask questions (needsClarification: true) when the decision is missing context that would change which analytical approach fits — for example: unclear domain, unknown stakes, missing time horizon, ambiguous alternatives, or unknown relationship between parties.

Examples that SHOULD get questions:
- "I don't know what to do" → what domain? what options?
- "Should I do it?" → do what? what are the options?
- "Thinking about a big change" → what kind of change? personal, career, financial?
- "Help me decide" → decide what?
- "I'm torn between two things" → what are they?
- "Should I take the offer?" → what kind of offer? career, financial, partnership?

Examples that should skip (needsClarification: false):
- "Should I leave my $120k engineering job at Google for a 3-person startup paying $90k?" → specific enough
- "Whether to move closer to family or stay for my career" → clear trade-off
- "How to prioritize Q3 features: payments, notifications, or analytics" → concrete alternatives

When you do ask questions, make them:
- Focused on what genuinely changes the analysis, not nice background detail
- choice type with 3–5 concrete options when obvious buckets exist; text type when open-ended
- multiSelect: true only when more than one option realistically applies at once

Return needsClarification: false and questions: [] when the decision is specific enough to analyze directly.`;

export type ClarifyQuestion =
  | { id: string; text: string; type: "text" }
  | { id: string; text: string; type: "choice"; options: string[]; multiSelect: boolean };

export type ClarifyResult =
  | { ok: true; skip: true }
  | { ok: true; skip: false; questions: ClarifyQuestion[] }
  | { ok: false; code: "INVALID_INPUT" | "NO_API_KEY"; status: number; detail: string };

export async function runClarify(input: { decisionText?: unknown }): Promise<ClarifyResult> {
  const decisionText = input.decisionText;
  if (!decisionText || typeof decisionText !== "string" || !decisionText.trim()) {
    return { ok: false, code: "INVALID_INPUT", status: 400, detail: "decisionText missing" };
  }
  if (!apiKey) {
    return { ok: false, code: "NO_API_KEY", status: 500, detail: "missing env: ANTHROPIC_API_KEY or AI_GATEWAY_API_KEY" };
  }

  try {
    const { object } = await generateObject({
      model: anthropic("claude-haiku-4-5"),
      schema: ResponseSchema,
      system: SYSTEM,
      prompt: `Decision the user submitted:\n\n"${decisionText.trim()}"`,
      maxOutputTokens: 800,
    });

    if (!object.needsClarification || object.questions.length === 0) {
      return { ok: true, skip: true };
    }

    const questions: ClarifyQuestion[] = object.questions
      .filter((q) => q.type !== "choice" || (q.options && q.options.length >= 2))
      .map((q): ClarifyQuestion => q.type === "choice"
        ? { id: q.id, text: q.text, type: "choice", options: q.options ?? [], multiSelect: q.multiSelect ?? false }
        : { id: q.id, text: q.text, type: "text" });

    if (questions.length === 0) return { ok: true, skip: true };
    return { ok: true, skip: false, questions };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[insights/clarify] failed:", message);
    // Treat clarify failures as skip — the UI route already does this, and an
    // API caller can still proceed to analyze.
    return { ok: true, skip: true };
  }
}
