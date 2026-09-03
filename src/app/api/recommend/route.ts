import { generateText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { NextResponse } from "next/server";
import { FRAMEWORKS, type FrameworkId } from "@/frameworks";
import { buildError } from "@/lib/errors";

const apiKey = process.env["ANTHROPIC_API_KEY"] ?? process.env["AI_GATEWAY_API_KEY"];
const anthropic = createAnthropic(apiKey ? { apiKey } : {});

export const maxDuration = 60;

const SYSTEM = `You are an expert decision-analysis tool. The user has filled in a framework and wants a fresh "note" that reacts to the current values.

Write a calm, second-person note — like a thoughtful older friend. Two short paragraphs, ~90-130 words. No bullet points, no headings, no exclamation marks, no emoji. Do not use the word "framework". Begin the first paragraph with a strong opening word (it will get a drop cap). Reference what the data actually shows.

If the data includes a "biasFindings" list, those are cognitive biases flagged in the user's write-up. Entries with "dismissed": true were judged not applicable by the user; ignore them. Let the remaining ones temper the note: acknowledge the strongest in a sentence, gently, without listing them or lecturing.`;

function classify(err: unknown): { key: "AUTH" | "RATE_LIMIT" | "UPSTREAM" | "UNKNOWN"; status: number } {
  const message = err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase();
  if (message.includes("401") || message.includes("unauthorized") || message.includes("invalid api key") || message.includes("authentication")) {
    return { key: "AUTH", status: 502 };
  }
  if (message.includes("429") || message.includes("rate limit") || message.includes("too many requests")) {
    return { key: "RATE_LIMIT", status: 429 };
  }
  if (message.includes("fetch failed") || message.includes("econnrefused") || message.includes("etimedout") || message.includes("network")) {
    return { key: "UPSTREAM", status: 502 };
  }
  return { key: "UNKNOWN", status: 500 };
}

export async function POST(req: Request) {
  const { decisionText, result } = await req.json() as {
    decisionText?: string;
    result?: { framework?: string } & Record<string, unknown>;
  };

  if (!decisionText || typeof decisionText !== "string") {
    return NextResponse.json(buildError("INVALID_INPUT", "decisionText missing"), { status: 400 });
  }
  if (!result || typeof result !== "object") {
    return NextResponse.json(buildError("INVALID_INPUT", "result missing"), { status: 400 });
  }
  if (!apiKey) {
    return NextResponse.json(buildError("NO_API_KEY", "missing env: ANTHROPIC_API_KEY or AI_GATEWAY_API_KEY"), { status: 500 });
  }

  const meta = FRAMEWORKS.find((f) => f.id === result.framework as FrameworkId);
  if (!meta) {
    return NextResponse.json(buildError("UNKNOWN_FRAMEWORK", `id=${String(result.framework)}`), { status: 400 });
  }

  // Strip the existing recommendation so the model writes a fresh one.
  const { recommendation: _drop, ...rest } = result as Record<string, unknown>;
  void _drop;
  const dataJson = JSON.stringify(rest, null, 2);

  try {
    const generated = await generateText({
      model: anthropic("claude-haiku-4-5"),
      system: SYSTEM,
      prompt: `Decision:\n\n"${decisionText}"\n\nFramework: ${meta.name} (${meta.category})\n\nCurrent filled-in data:\n\n${dataJson}\n\nWrite the note now. Plain text, no JSON, no markdown.`,
      maxOutputTokens: 600,
    });
    return NextResponse.json({ recommendation: generated.text.trim() });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/recommend] failed:", message);
    const { key, status } = classify(err);
    return NextResponse.json(buildError(key, message), { status });
  }
}
