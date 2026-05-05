import { generateObject, NoObjectGeneratedError } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { NextResponse } from "next/server";
import { z } from "zod";
import { FRAMEWORKS, SCHEMAS, type FrameworkId, type FrameworkResult } from "@/frameworks";
import { buildError } from "@/lib/errors";

const apiKey = process.env["ANTHROPIC_API_KEY"] ?? process.env["AI_GATEWAY_API_KEY"];
const anthropic = createAnthropic(apiKey ? { apiKey } : {});

export const maxDuration = 60;

const ChatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});
type ChatMessage = z.infer<typeof ChatMessageSchema>;

const RequestSchema = z.object({
  frameworkId: z.string(),
  decisionText: z.string(),
  currentData: z.unknown(),
  messages: z.array(ChatMessageSchema),
  // If true, ignore messages and produce the opening assistant turn.
  kickoff: z.boolean().optional(),
});

function classify(err: unknown): { key: "AUTH" | "RATE_LIMIT" | "UPSTREAM" | "UNKNOWN"; status: number } {
  const message = err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase();
  if (message.includes("401") || message.includes("unauthorized") || message.includes("invalid api key")) {
    return { key: "AUTH", status: 502 };
  }
  if (message.includes("429") || message.includes("rate limit")) {
    return { key: "RATE_LIMIT", status: 429 };
  }
  if (message.includes("fetch failed") || message.includes("econnrefused") || message.includes("etimedout")) {
    return { key: "UPSTREAM", status: 502 };
  }
  return { key: "UNKNOWN", status: 500 };
}

const SYSTEM = `You are a warm, focused interviewer helping the user populate a decision-making framework through a back-and-forth conversation. You always speak in second person and stay calm and brief.

Rules:
- Ask EXACTLY ONE focused question per turn. Never bundle two questions.
- Keep "reply" short — 1 to 3 sentences. No bullet lists, no headings, no markdown, no emoji.
- Refer to fields by plain English (e.g. "what's your best alternative if this falls through?"), never by JSON keys.
- Look at the framework data the user already has. Find the weakest, vaguest, or most-placeholder-looking part and ask about THAT next. If a field is filled in but generic, push for specifics.
- When the user gives you new information, return the FULL updated framework data in "updatedData" — copy every existing field, then revise the parts the user just informed. Preserve required array lengths and value ranges. The "framework" and "category" fields must stay exactly as provided.
- If the user's message is just chit-chat, a clarification question, or doesn't add usable signal, return updatedData = null and either answer them briefly or steer back to the next question.
- The "recommendation" field should ONLY change if the underlying data changed enough that the prior recommendation is misleading; if you do rewrite it, keep the same calm two-paragraph older-friend tone.
- Set "done" = true ONLY when the user explicitly says they're finished, or every part of the framework feels specific and grounded in their own words. Otherwise keep it false and ask the next question.`;

function buildKickoffPrompt(meta: { name: string; blurb: string }, decisionText: string, currentData: unknown): string {
  return `Decision the user is wrestling with:\n"${decisionText}"\n\nFramework: ${meta.name} — ${meta.blurb}\n\nThe framework has been pre-filled with the AI's first guess. Here it is:\n${JSON.stringify(currentData, null, 2)}\n\nThis is the OPENING turn. Briefly (one sentence) acknowledge that you'll help them refine this together, then ask the single most useful first question to make the framework reflect their real situation. Set updatedData = null and done = false.`;
}

function buildTurnPrompt(meta: { name: string; blurb: string }, decisionText: string, currentData: unknown): string {
  return `Decision: "${decisionText}"\nFramework: ${meta.name} — ${meta.blurb}\n\nCurrent framework data:\n${JSON.stringify(currentData, null, 2)}\n\nThe full conversation so far is in the messages above. Read the user's most recent message, decide whether it gives you new information about the framework, and respond per the rules.`;
}

export async function POST(req: Request) {
  if (!apiKey) {
    return NextResponse.json(buildError("NO_API_KEY", "missing env: ANTHROPIC_API_KEY or AI_GATEWAY_API_KEY"), { status: 500 });
  }

  let body: z.infer<typeof RequestSchema>;
  try {
    body = RequestSchema.parse(await req.json());
  } catch (err) {
    return NextResponse.json(buildError("INVALID_INPUT", err instanceof Error ? err.message : "bad body"), { status: 400 });
  }

  const id = body.frameworkId as FrameworkId;
  const meta = FRAMEWORKS.find((f) => f.id === id);
  const dataSchema = SCHEMAS[id];
  if (!meta || !dataSchema) {
    return NextResponse.json(buildError("UNKNOWN_FRAMEWORK", `id=${id}`), { status: 400 });
  }

  // Per-turn schema: a structured response that may carry an updated framework.
  // We use z.unknown() for updatedData and validate against the framework
  // schema ourselves — embedding the discriminated framework schema directly
  // forces the model to re-emit the discriminator under more pressure than is
  // necessary for a chat turn.
  const turnSchema = z.object({
    reply: z.string().min(1).max(800),
    updatedData: z.unknown().nullable(),
    done: z.boolean(),
  });

  const model = anthropic("claude-haiku-4-5");

  const messagesForModel: { role: "user" | "assistant"; content: string }[] = body.kickoff
    ? [{ role: "user", content: buildKickoffPrompt(meta, body.decisionText, body.currentData) }]
    : [
        { role: "user", content: buildTurnPrompt(meta, body.decisionText, body.currentData) },
        ...body.messages.map((m: ChatMessage) => ({ role: m.role, content: m.content })),
      ];

  try {
    const generated = await generateObject({
      model,
      schema: turnSchema,
      system: SYSTEM,
      messages: messagesForModel,
      maxOutputTokens: 4000,
    });

    let validatedData: FrameworkResult | null = null;
    if (generated.object.updatedData !== null) {
      const parsed = dataSchema.safeParse(generated.object.updatedData);
      if (parsed.success) {
        validatedData = parsed.data as FrameworkResult;
      } else {
        // Don't fail the turn — just drop the bad patch and let the user retry.
        console.warn("[/api/chat-fill] dropped invalid updatedData:", parsed.error.message);
      }
    }

    return NextResponse.json({
      reply: generated.object.reply,
      updatedData: validatedData,
      done: generated.object.done,
    });
  } catch (err) {
    let detail = err instanceof Error ? err.message : "Unknown error";
    if (NoObjectGeneratedError.isInstance(err)) {
      detail = `NoObjectGenerated finishReason=${err.finishReason} text=${(err.text ?? "").slice(0, 300)}`;
    }
    console.error("[/api/chat-fill] failed:", detail);
    const { key, status } = classify(err);
    return NextResponse.json(buildError(key === "UNKNOWN" ? "SCHEMA_FAIL" : key, detail), { status });
  }
}
