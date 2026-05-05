import { generateObject } from "ai";
import { NextResponse } from "next/server";
import {
  DecisionMatrixSchema,
  EisenhowerSchema,
  FrameworkSchema,
  SwotSchema,
} from "@/lib/schemas";

export const maxDuration = 60;

const SYSTEM = `You are a decision-making coach. Given a user's described decision,
pick the SINGLE most appropriate framework from this set and produce a
fully populated structured response that fits its schema.

Frameworks:
- "decision_matrix": when the user is choosing between concrete alternatives
  with multiple criteria (e.g. picking a job offer, a city, a tool).
- "eisenhower": when the user is overwhelmed by many tasks and needs to
  prioritize urgent vs. important.
- "swot": when the user faces an open-ended strategic decision (e.g.
  starting a business, changing careers, launching a product).

Always include a clear "recommendation" — what the user should do and why.
Be concrete; use details from the user's description.`;

export async function POST(req: Request) {
  const { text, framework } = await req.json();

  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const model = "anthropic/claude-sonnet-4-6";

  try {
    let result;
    if (framework === "decision_matrix") {
      const r = await generateObject({
        model,
        system: SYSTEM,
        schema: DecisionMatrixSchema,
        prompt: text,
      });
      result = r.object;
    } else if (framework === "eisenhower") {
      const r = await generateObject({
        model,
        system: SYSTEM,
        schema: EisenhowerSchema,
        prompt: text,
      });
      result = r.object;
    } else if (framework === "swot") {
      const r = await generateObject({
        model,
        system: SYSTEM,
        schema: SwotSchema,
        prompt: text,
      });
      result = r.object;
    } else {
      const r = await generateObject({
        model,
        system: SYSTEM,
        schema: FrameworkSchema,
        prompt: text,
      });
      result = r.object;
    }

    return NextResponse.json({ result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
