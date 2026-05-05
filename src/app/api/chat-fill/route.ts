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

const SYSTEM = `You are a form-filling assistant. Your job is NOT to chat about the user's situation, NOT to give advice, and NOT to summarize. Your single job is to walk the user through the framework's fields one at a time and collect a concrete value for each.

Each turn:
1. Look at the framework's schema and the current data. Find the SINGLE most important field that is still missing, generic, or clearly placeholder.
2. Write a "reply" that:
   - Names the specific field in plain English, including any item/option context (e.g. "For the option 'Take the new role'…").
   - Briefly explains what that field represents (one short clause is enough — what it captures, what a high vs low value means, what units it's in).
   - States the exact answer format you need: a number in a given range, a short text, a list of N items, one of an enum's values, true/false, etc.
   - Ends with the question itself, phrased so the user can answer in one sentence.
3. Apply any value the user just gave you to "updatedDataJson" (a JSON string of the FULL framework data with that one field updated). Copy every existing field; never drop or shorten arrays the schema requires. Preserve "framework" and "category" exactly. JSON must be parseable.
4. If the user's message did NOT supply a usable value (chit-chat, a clarifying question of their own, or a refusal), set "updatedDataJson" to "" and either answer their clarifying question in one sentence then re-ask the same field, or rephrase the field question more clearly.
5. NEVER ask multiple questions in one turn. NEVER discuss the case in general. NEVER offer advice or opinions. NEVER touch the "recommendation" field — leave it as-is.
6. Set "done" = true ONLY when every field has a concrete, specific value (no placeholders, no generic stand-ins). Otherwise keep it false.

Style:
- Plain, direct, second person. 1-3 sentences total.
- No markdown, no bullet lists, no emoji, no headings.
- Reference fields by their meaning, not their JSON key. "How much would you regret it?" not "regret_score".

Example of a good reply (Regret Minimization, asking about regret_if_chosen for an option named "Take the new role"):
"For the option 'Take the new role', I need a regret score from 1 to 10 — where 1 is 'I'd barely think about it again' and 10 is 'I'd be devastated I picked this'. How much would you regret choosing it?"`;

function fieldList(jsonSchema: unknown): string {
  // Best-effort: turn the JSON Schema into a compact bullet list of fields
  // with their types/constraints, so the model has explicit knowledge of
  // what each field expects (range, enum, length, etc).
  try {
    const root = jsonSchema as { properties?: Record<string, unknown>; required?: string[] };
    if (!root || typeof root !== "object" || !root.properties) return "";
    const lines: string[] = [];
    for (const [key, raw] of Object.entries(root.properties)) {
      const prop = raw as Record<string, unknown>;
      const bits: string[] = [];
      if (typeof prop["type"] === "string") bits.push(String(prop["type"]));
      if (Array.isArray(prop["enum"])) bits.push(`one of: ${(prop["enum"] as unknown[]).join(", ")}`);
      if (typeof prop["minimum"] === "number" || typeof prop["maximum"] === "number") {
        bits.push(`range ${prop["minimum"] ?? "?"}–${prop["maximum"] ?? "?"}`);
      }
      if (typeof prop["minItems"] === "number" || typeof prop["maxItems"] === "number") {
        bits.push(`length ${prop["minItems"] ?? "?"}–${prop["maxItems"] ?? "?"}`);
      }
      if (typeof prop["description"] === "string") bits.push(String(prop["description"]));
      lines.push(`- ${key} (${bits.join("; ") || "any"})`);
    }
    return lines.join("\n");
  } catch {
    return "";
  }
}

function buildKickoffPrompt(meta: { name: string; blurb: string }, decisionText: string, currentData: unknown, schemaJson: unknown): string {
  const fields = fieldList(schemaJson);
  return `Decision the user is wrestling with:\n"${decisionText}"\n\nFramework: ${meta.name} — ${meta.blurb}\n\nFramework fields and their constraints:\n${fields || "(no field metadata available — infer from the current data)"}\n\nThe framework has been pre-filled with an AI's first guess. Current data:\n${JSON.stringify(currentData, null, 2)}\n\nThis is the OPENING turn. Do NOT greet the user, do NOT explain your role, do NOT summarize the framework. Pick the SINGLE most important field whose current value is generic, placeholder, or empty, and ask about it directly using the format described in the system prompt. Set updatedDataJson to "" and done to false.`;
}

function buildTurnPrompt(meta: { name: string; blurb: string }, decisionText: string, currentData: unknown, schemaJson: unknown): string {
  const fields = fieldList(schemaJson);
  return `Decision: "${decisionText}"\nFramework: ${meta.name} — ${meta.blurb}\n\nFramework fields and their constraints:\n${fields || "(no field metadata available — infer from the current data)"}\n\nCurrent framework data (already includes any patches from previous turns):\n${JSON.stringify(currentData, null, 2)}\n\nThe full conversation so far is in the messages above. Read the user's MOST RECENT message:\n- If it gives a concrete value for the field you just asked about, write the FULL updated framework JSON into updatedDataJson with that one field changed.\n- Then move on to the NEXT most important still-generic field and ask the next question per the system rules.\n- If the user did not supply a usable value, leave updatedDataJson as "" and re-ask or clarify.`;
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

  // Best-effort JSON Schema for field constraints; fall back to undefined if it throws.
  let schemaJson: unknown;
  try {
    schemaJson = z.toJSONSchema(dataSchema);
  } catch {
    schemaJson = undefined;
  }

  const messagesForModel: { role: "user" | "assistant"; content: string }[] = body.kickoff
    ? [{ role: "user", content: buildKickoffPrompt(meta, body.decisionText, body.currentData, schemaJson) }]
    : [
        { role: "user", content: buildTurnPrompt(meta, body.decisionText, body.currentData, schemaJson) },
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
