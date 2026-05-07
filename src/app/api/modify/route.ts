import { generateObject, NoObjectGeneratedError } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { NextResponse } from "next/server";
import { FRAMEWORKS, SAMPLES, SCHEMAS, type FrameworkId } from "@/frameworks";
import { buildError } from "@/lib/errors";

const apiKey = process.env["ANTHROPIC_API_KEY"] ?? process.env["AI_GATEWAY_API_KEY"];
const anthropic = createAnthropic(apiKey ? { apiKey } : {});

export const maxDuration = 60;

const SYSTEM = `You are applying a user's modification request to an existing decision-framework dataset. Apply exactly what the user asks — nothing more, nothing less. Preserve every field the user did not mention, including "framework", "category", "title", and "recommendation". Return the complete framework JSON with only the requested changes made.`;

function classify(err: unknown): { status: number } {
  const msg = err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase();
  if (msg.includes("401") || msg.includes("unauthorized")) return { status: 502 };
  if (msg.includes("429") || msg.includes("rate limit")) return { status: 429 };
  return { status: 500 };
}

export async function POST(req: Request) {
  const body = await req.json() as {
    decisionText?: string;
    currentData?: Record<string, unknown>;
    instruction?: string;
  };
  const { decisionText, currentData, instruction } = body;

  if (!decisionText || typeof decisionText !== "string") {
    return NextResponse.json(buildError("INVALID_INPUT", "decisionText missing"), { status: 400 });
  }
  if (!currentData || typeof currentData !== "object") {
    return NextResponse.json(buildError("INVALID_INPUT", "currentData missing"), { status: 400 });
  }
  if (!instruction || typeof instruction !== "string" || !instruction.trim()) {
    return NextResponse.json(buildError("INVALID_INPUT", "instruction missing"), { status: 400 });
  }
  if (!apiKey) {
    return NextResponse.json(buildError("NO_API_KEY", "missing env: ANTHROPIC_API_KEY or AI_GATEWAY_API_KEY"), { status: 500 });
  }

  const frameworkId = currentData["framework"] as FrameworkId;
  const meta = FRAMEWORKS.find((f) => f.id === frameworkId);
  if (!meta) {
    return NextResponse.json(buildError("UNKNOWN_FRAMEWORK", `id=${String(frameworkId)}`), { status: 400 });
  }

  const schema = SCHEMAS[frameworkId];
  const sample = SAMPLES[frameworkId];

  const prompt = `Decision: "${decisionText}"
Framework: ${meta.name} (id: "${frameworkId}", category: "${meta.category}")

Current data:
${JSON.stringify(currentData, null, 2)}

User's modification request: "${instruction.trim()}"

Apply the modification and return the complete updated framework JSON. The "framework" field must remain "${frameworkId}" and "category" must remain "${meta.category}". Preserve "recommendation" exactly as-is. Here is a valid schema example for shape reference (different decision):

${JSON.stringify(sample, null, 2)}`;

  const MAX_ATTEMPTS = 2;
  const errors: string[] = [];

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const extra = attempt === 1 ? "" : `\n\nIMPORTANT: previous attempt failed schema validation (${errors.join(" | ")}). Be strict about array lengths, numeric ranges, and required keys.`;
    try {
      const generated = await generateObject({
        model: anthropic("claude-haiku-4-5"),
        schema,
        system: SYSTEM,
        prompt: prompt + extra,
        maxOutputTokens: 8000,
      });
      return NextResponse.json({ updatedData: generated.object });
    } catch (err) {
      let detail = err instanceof Error ? err.message : "Unknown error";
      if (NoObjectGeneratedError.isInstance(err)) {
        detail = `NoObjectGenerated finishReason=${err.finishReason} text=${(err.text ?? "").slice(0, 300)}`;
      }
      errors.push(`attempt ${attempt}: ${detail}`);
      console.warn(`[/api/modify] attempt ${attempt}/${MAX_ATTEMPTS} failed:`, detail);
    }
  }

  const last = errors[errors.length - 1] ?? "unknown";
  const { status } = classify(new Error(last));
  return NextResponse.json(buildError("SCHEMA_FAIL", last), { status });
}
