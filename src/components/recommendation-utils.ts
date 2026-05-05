import type { FrameworkResult, FrameworkId } from "@/frameworks";
import { FRAMEWORKS } from "@/frameworks";

export type RecFramework = FrameworkId;

export interface RecContext {
  decisionText: string;
  result: FrameworkResult;
}

function buildSummary(ctx: RecContext): string {
  const r = ctx.result;
  const meta = FRAMEWORKS.find((f) => f.id === r.framework);
  const name = meta?.name ?? r.framework;

  if (r.framework === "decision_matrix") {
    const totalW = r.criteria.reduce((s, c) => s + c.weight, 0) || 1;
    const lines = r.options.map((o) => {
      const total = o.scores.reduce((sum, s, j) => sum + s * ((r.criteria[j]?.weight ?? 0) / totalW), 0);
      return `${o.name}: ${total.toFixed(2)} (${o.scores.map((s, j) => `${r.criteria[j]?.name ?? ""}=${s}`).join(", ")})`;
    });
    const weights = r.criteria.map((c) => `${c.name}=${Math.round((c.weight / totalW) * 100)}%`).join(", ");
    return `Framework: ${name}.\nWeights: ${weights}.\nOptions:\n- ${lines.join("\n- ")}`;
  }

  if (r.framework === "cost_benefit") {
    const benTotal = r.benefits.reduce((s, x) => s + x.weight, 0);
    const costTotal = r.costs.reduce((s, x) => s + x.weight, 0);
    return `Framework: ${name}.\nBenefit total = ${benTotal}, Cost total = ${costTotal}, diff = ${benTotal - costTotal}.\nBenefits: ${r.benefits.map((b) => `${b.text} (w=${b.weight})`).join("; ")}.\nCosts: ${r.costs.map((c) => `${c.text} (w=${c.weight})`).join("; ")}.`;
  }

  if (r.framework === "swot") {
    const fmt = (k: string[]) => k.filter(Boolean).join("; ") || "—";
    return `Framework: ${name}.\nStrengths: ${fmt(r.strengths)}.\nWeaknesses: ${fmt(r.weaknesses)}.\nOpportunities: ${fmt(r.opportunities)}.\nThreats: ${fmt(r.threats)}.`;
  }

  // Generic summary for the other 58 frameworks: dump the discriminating fields as JSON.
  // This gives the LLM enough state to write a thoughtful note.
  const { framework, category, title, recommendation, ...rest } = r as Record<string, unknown> & {
    framework: string; category?: string; title?: string; recommendation?: string;
  };
  void framework; void category; void title; void recommendation;
  return `Framework: ${name} (${meta?.category ?? r.category}).\nFields:\n${JSON.stringify(rest, null, 2)}`;
}

const SYSTEM_VOICE = `You are the writer of a quiet, literary thinking tool called "Decision Making". The user is weighing a real decision; they have just filled in a framework. Your job is to write the recommendation: a short, calm, second-person note — like a thoughtful older friend who has read more than you. Calm, literary, takes the user seriously. No exclamation marks, no emoji, no bullet points, no headings. Two short paragraphs, ~90-130 words total. The first paragraph names what the framework points to and why, in plain language. The second paragraph adds one observation or watch-for that the data alone wouldn't catch. Do NOT start with "Dear" or any salutation. Do NOT sign off. Do not use the word "framework". Begin the very first paragraph with a strong opening word (it will get a drop cap).`;

export function buildPrompt(ctx: RecContext): string {
  return `${SYSTEM_VOICE}\n\nDECISION:\n"${ctx.decisionText}"\n\nWHAT THE USER FILLED IN:\n${buildSummary(ctx)}\n\nWrite the recommendation now, two short paragraphs separated by a blank line.`;
}

export async function fetchRecommendation(ctx: RecContext): Promise<string> {
  const res = await fetch("/api/recommend", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ prompt: buildPrompt(ctx) }),
  });
  const data = await res.json() as {
    text?: string;
    error?: string | { code?: string; message?: string; detail?: string };
  };
  if (!res.ok) {
    const e = data.error;
    const message = typeof e === "string"
      ? e
      : (e && typeof e === "object" && typeof e.message === "string" ? e.message : `API error ${res.status}`);
    throw new Error(message);
  }
  const text = data.text?.trim() ?? "";
  if (!text) throw new Error("Empty response from API");
  return text;
}
