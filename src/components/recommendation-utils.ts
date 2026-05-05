import type { DecisionMatrix } from "@/frameworks/decision-matrix/schema";
import type { CostBenefit } from "@/frameworks/cost-benefit/schema";
import type { Swot } from "@/frameworks/swot/schema";

export type RecFramework = "decision_matrix" | "cost_benefit" | "swot";

export interface RecContext {
  decisionText: string;
  framework: RecFramework;
  matrix: DecisionMatrix;
  costBenefit: CostBenefit;
  swot: Swot;
}

function buildSummary(ctx: RecContext): string {
  const { framework, matrix, costBenefit: cb, swot } = ctx;

  if (framework === "decision_matrix") {
    const totalW = matrix.criteria.reduce((s, c) => s + c.weight, 0) || 1;
    const lines = matrix.options.map((o) => {
      const total = o.scores.reduce((sum, s, j) => sum + s * ((matrix.criteria[j]?.weight ?? 0) / totalW), 0);
      return `${o.name}: ${total.toFixed(2)} (${o.scores.map((s, j) => `${matrix.criteria[j]?.name ?? ""}=${s}`).join(", ")})`;
    });
    const weights = matrix.criteria.map((c) => `${c.name}=${Math.round((c.weight / totalW) * 100)}%`).join(", ");
    return `Framework: Decision Matrix.\nWeights: ${weights}.\nOptions:\n- ${lines.join("\n- ")}`;
  }

  if (framework === "cost_benefit") {
    const benTotal  = cb.benefits.reduce((s, x) => s + x.weight, 0);
    const costTotal = cb.costs.reduce((s, x) => s + x.weight, 0);
    return `Framework: Cost–Benefit.\nBenefit total = ${benTotal}, Cost total = ${costTotal}, diff = ${benTotal - costTotal}.\nBenefits: ${cb.benefits.map((b) => `${b.text} (w=${b.weight})`).join("; ")}.\nCosts: ${cb.costs.map((c) => `${c.text} (w=${c.weight})`).join("; ")}.`;
  }

  // swot
  const fmt = (k: string[]) => k.filter(Boolean).join("; ") || "—";
  return `Framework: SWOT.\nStrengths: ${fmt(swot.strengths)}.\nWeaknesses: ${fmt(swot.weaknesses)}.\nOpportunities: ${fmt(swot.opportunities)}.\nThreats: ${fmt(swot.threats)}.`;
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
  const data = await res.json() as { text?: string; error?: string };
  if (!res.ok) throw new Error(data.error ?? `API error ${res.status}`);
  const text = data.text?.trim() ?? "";
  if (!text) throw new Error("Empty response from API");
  return text;
}
