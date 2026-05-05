import type { FrameworkResult } from "@/frameworks";

export type AnalysisResult = FrameworkResult;

const MAX_ATTEMPTS = 3;

async function attempt(decisionText: string): Promise<AnalysisResult> {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ decisionText }),
  });
  const data = await res.json() as AnalysisResult & { error?: string };
  if (!res.ok) throw new Error((data as { error?: string }).error ?? `API error ${res.status}`);
  return data;
}

export async function fetchAnalysis(decisionText: string): Promise<AnalysisResult> {
  let lastErr: unknown;
  for (let i = 1; i <= MAX_ATTEMPTS; i++) {
    try {
      return await attempt(decisionText);
    } catch (err) {
      lastErr = err;
      console.warn(`[analyze] attempt ${i}/${MAX_ATTEMPTS} failed:`, err);
      if (i < MAX_ATTEMPTS) {
        // Exponential backoff: 500ms, 1500ms
        await new Promise((r) => setTimeout(r, 500 * Math.pow(3, i - 1)));
      }
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("analyze failed after retries");
}
