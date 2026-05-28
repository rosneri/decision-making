import { generateObject, NoObjectGeneratedError } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { FRAMEWORKS, SAMPLES, SCHEMAS, type FrameworkId } from "@/frameworks";

const apiKey = process.env["ANTHROPIC_API_KEY"] ?? process.env["AI_GATEWAY_API_KEY"];
const anthropic = createAnthropic(apiKey ? { apiKey } : {});

const SYSTEM = `You are an expert decision-analysis tool. The user has reviewed their framework data and wants a targeted adjustment. Apply exactly what the user asks to the current data and return the complete updated framework JSON. Preserve every field that is not affected by the adjustment, including "framework", "category", "title", and "recommendation".`;

export type ModifyErrorCode =
  | "INVALID_INPUT"
  | "NO_API_KEY"
  | "UNKNOWN_FRAMEWORK"
  | "SCHEMA_FAIL"
  | "RATE_LIMIT"
  | "AUTH"
  | "UNKNOWN";

export type ModifyResult =
  | { ok: true; data: Record<string, unknown> }
  | { ok: false; code: ModifyErrorCode; status: number; detail: string };

function classify(err: unknown): { code: ModifyErrorCode; status: number } {
  const msg = err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase();
  if (msg.includes("401") || msg.includes("unauthorized")) return { code: "AUTH", status: 502 };
  if (msg.includes("429") || msg.includes("rate limit")) return { code: "RATE_LIMIT", status: 429 };
  return { code: "UNKNOWN", status: 500 };
}

export async function runModify(input: {
  decisionText?: unknown;
  currentData?: unknown;
  instruction?: unknown;
}): Promise<ModifyResult> {
  const { decisionText, currentData, instruction } = input;

  if (!decisionText || typeof decisionText !== "string") {
    return { ok: false, code: "INVALID_INPUT", status: 400, detail: "decisionText missing" };
  }
  if (!currentData || typeof currentData !== "object") {
    return { ok: false, code: "INVALID_INPUT", status: 400, detail: "currentData missing" };
  }
  if (!instruction || typeof instruction !== "string" || !instruction.trim()) {
    return { ok: false, code: "INVALID_INPUT", status: 400, detail: "instruction missing" };
  }
  if (!apiKey) {
    return { ok: false, code: "NO_API_KEY", status: 500, detail: "missing env: ANTHROPIC_API_KEY or AI_GATEWAY_API_KEY" };
  }

  const data = currentData as Record<string, unknown>;
  const frameworkId = data["framework"] as FrameworkId;
  const meta = FRAMEWORKS.find((f) => f.id === frameworkId);
  if (!meta) {
    return { ok: false, code: "UNKNOWN_FRAMEWORK", status: 400, detail: `id=${String(frameworkId)}` };
  }

  const schema = SCHEMAS[frameworkId];
  const sample = SAMPLES[frameworkId];

  const prompt = (extraGuidance = "") =>
    `Decision the user is working through:
"${decisionText}"

Framework: ${meta.name} (id: "${frameworkId}", category: "${meta.category}")

Current framework data (all fields — copy every field you are not changing exactly as-is):
${JSON.stringify(data, null, 2)}

User's adjustment: "${instruction.trim()}"

Return the complete updated framework JSON with only the fields affected by the adjustment changed. The "framework" field must remain "${frameworkId}", "category" must remain "${meta.category}", and "recommendation" must remain unchanged. Schema shape reference:
${JSON.stringify(sample, null, 2)}${extraGuidance}`;

  const MAX_ATTEMPTS = 2;
  const errors: string[] = [];

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const extra = attempt === 1 ? "" : `\n\nIMPORTANT: previous attempt failed schema validation (${errors.join(" | ")}). Be strict about array lengths, numeric ranges, and required keys.`;
    try {
      const generated = await generateObject({
        model: anthropic("claude-haiku-4-5"),
        schema,
        system: SYSTEM,
        prompt: prompt(extra),
        maxOutputTokens: 8000,
      });
      return { ok: true, data: generated.object as Record<string, unknown> };
    } catch (err) {
      let detail = err instanceof Error ? err.message : "Unknown error";
      if (NoObjectGeneratedError.isInstance(err)) {
        detail = `NoObjectGenerated finishReason=${err.finishReason} text=${(err.text ?? "").slice(0, 300)}`;
      }
      errors.push(`attempt ${attempt}: ${detail}`);
      console.warn(`[insights/modify] attempt ${attempt}/${MAX_ATTEMPTS} failed:`, detail);
    }
  }

  const last = errors[errors.length - 1] ?? "unknown";
  const { status } = classify(new Error(last));
  return { ok: false, code: "SCHEMA_FAIL", status, detail: last };
}
