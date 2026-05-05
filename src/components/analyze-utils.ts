import type { FrameworkResult } from "@/frameworks";

export type AnalysisResult = FrameworkResult;

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
