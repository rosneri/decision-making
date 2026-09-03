import { generateText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { NextResponse } from "next/server";
import { FRAMEWORKS, type FrameworkId } from "@/frameworks";
import { buildError } from "@/lib/errors";

const apiKey = process.env["ANTHROPIC_API_KEY"] ?? process.env["AI_GATEWAY_API_KEY"];
const anthropic = createAnthropic(apiKey ? { apiKey } : {});

export const maxDuration = 30;

const SYSTEM = `You are explaining a decision analysis to someone unfamiliar with the method used. Write 2–3 short paragraphs in plain, direct English. Explain what information was gathered, how it was structured or weighed, and what that revealed. Do not name the framework. Do not give advice. Do not use jargon or bullet points. Begin the first sentence with a strong active verb.`;

function classify(err: unknown): number {
  const msg = err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase();
  if (msg.includes("401") || msg.includes("unauthorized")) return 502;
  if (msg.includes("429") || msg.includes("rate limit")) return 429;
  return 500;
}

export async function POST(req: Request) {
  const body = await req.json() as { decisionText?: string; result?: Record<string, unknown> };
  const { decisionText, result } = body;

  if (!decisionText || typeof decisionText !== "string" || !result || typeof result !== "object") {
    return NextResponse.json(buildError("INVALID_INPUT", "decisionText and result required"), { status: 400 });
  }
  if (!apiKey) {
    return NextResponse.json(buildError("NO_API_KEY", "missing env: ANTHROPIC_API_KEY or AI_GATEWAY_API_KEY"), { status: 500 });
  }

  const meta = FRAMEWORKS.find((f) => f.id === result["framework"] as FrameworkId);
  if (!meta) {
    return NextResponse.json(buildError("UNKNOWN_FRAMEWORK", `id=${String(result["framework"])}`), { status: 400 });
  }

  // Strip advisory fields so the model focuses on structural data
  const { recommendation: _r, altFrameworks: _a, biasFindings: _b, explanation: _e, ...data } = result;
  void _r; void _a; void _b; void _e;

  try {
    const { text } = await generateText({
      model: anthropic("claude-haiku-4-5"),
      system: SYSTEM,
      prompt: `Decision: "${decisionText}"\n\nAnalysis data:\n${JSON.stringify(data, null, 2)}\n\nExplain in plain English how this data led to the result. Plain text only — no markdown, no bullet points, no headings.`,
      maxOutputTokens: 400,
    });
    return NextResponse.json({ explanation: text.trim() });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/explain] failed:", message);
    return NextResponse.json(buildError("UNKNOWN", message), { status: classify(err) });
  }
}
