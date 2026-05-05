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
- When the user gives you new information, set "updatedDataJson" to a JSON string containing the FULL updated framework data — copy every existing field from the current data, then revise the parts the user just informed. Preserve required array lengths and value ranges. The "framework" and "category" fields must stay exactly as provided. Make sure the JSON is parseable (escape inner quotes, no trailing commas, no comments).
- If the user's message is just chit-chat, a clarification question, or doesn't add usable signal, set "updatedDataJson" to an empty string ("") and either answer them briefly or steer back to the next question.
- The "recommendation" field inside the framework data should ONLY change if the underlying data changed enough that the prior recommendation is misleading; if you do rewrite it, keep the same calm two-paragraph older-friend tone.
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

  // Per-turn schema: a flat object the model can reliably emit. We carry the
  // updated framework as a JSON string instead of a typed sub-schema — the
  // discriminated-union shape varies per framework and z.unknown() gives the
  // model no shape hint, so a JSON string is dramatically more reliable.
  const turnSchema = z.object({
    reply: z.string().min(1).max(800),
    updatedDataJson: z
      .string()
      .describe("JSON-stringified full framework data, or empty string if no update."),
    done: z.boolean(),
  });

  const model = anthropic("claude-haiku-4-5");

  const messagesForModel: { role: "user" | "assistant"; content: string }[] = body.kickoff
    ? [{ role: "user", content: buildKickoffPrompt(meta, body.decisionText, body.currentData) }]
    : [
        { role: "user", content: buildTurnPrompt(meta, body.decisionText, body.currentData) },
        ...body.messages.map((m: ChatMessage) => ({ role: m.role, content: m.content })),
      ];

  const MAX_ATTEMPTS = 2;
  const errors: string[] = [];
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const generated = await generateObject({
        model,
        schema: turnSchema,
        system: SYSTEM,
        messages: messagesForModel,
        maxOutputTokens: 4000,
      });

      let validatedData: FrameworkResult | null = null;
      const raw = generated.object.updatedDataJson?.trim();
      if (raw && raw !== "null") {
        try {
          const obj = JSON.parse(raw) as unknown;
          const parsed = dataSchema.safeParse(obj);
          if (parsed.success) {
            validatedData = parsed.data as FrameworkResult;
          } else {
            console.warn("[/api/chat-fill] dropped invalid updatedDataJson:", parsed.error.message);
          }
        } catch (jsonErr) {
          console.warn("[/api/chat-fill] updatedDataJson was not valid JSON:", jsonErr);
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
      errors.push(`attempt ${attempt}: ${detail}`);
      console.warn(`[/api/chat-fill] attempt ${attempt}/${MAX_ATTEMPTS} failed:`, detail);
      // Auth / rate-limit / network: don't burn the second attempt.
      const { key, status } = classify(err);
      if (key !== "UNKNOWN" || attempt === MAX_ATTEMPTS) {
        const code = key === "UNKNOWN" ? "SCHEMA_FAIL" : key;
        return NextResponse.json(buildError(code, errors.join(" || ")), { status });
      }
    }
  }
  // Unreachable — the loop always returns — but TS wants it.
  return NextResponse.json(buildError("SCHEMA_FAIL", errors.join(" || ")), { status: 502 });
}
