import type { DecisionMatrix } from "@/frameworks/decision-matrix/schema";
import type { CostBenefit } from "@/frameworks/cost-benefit/schema";
import type { Swot } from "@/frameworks/swot/schema";

export type AnalysisResult =
  | (Omit<DecisionMatrix, "category"> & { framework: "decision_matrix" })
  | (Omit<CostBenefit,    "category"> & { framework: "cost_benefit" })
  | (Omit<Swot,           "category"> & { framework: "swot" });

export async function fetchAnalysis(decisionText: string): Promise<AnalysisResult> {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ decisionText }),
  });
  const data = await res.json() as AnalysisResult & { error?: string };
  if (!res.ok) throw new Error((data as { error?: string }).error ?? `API error ${res.status}`);
  return data;
}
