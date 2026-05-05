import type { FrameworkResult } from "@/frameworks";
import { ANALYZE_ERRORS, type ApiErrorBody } from "@/lib/errors";

export type AnalysisResult = FrameworkResult;

export class AnalyzeError extends Error {
  code: string;
  detail: string | undefined;
  constructor(code: string, message: string, detail?: string) {
    super(message);
    this.code = code;
    this.detail = detail;
  }
}

export async function fetchAnalysis(decisionText: string): Promise<AnalysisResult> {
  let res: Response;
  try {
    res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ decisionText }),
    });
  } catch (e) {
    throw new AnalyzeError(ANALYZE_ERRORS.UPSTREAM.code, ANALYZE_ERRORS.UPSTREAM.message, e instanceof Error ? e.message : String(e));
  }

  if (!res.ok) {
    let body: ApiErrorBody | { error?: string } | null = null;
    try { body = await res.json() as ApiErrorBody; } catch { /* not JSON */ }
    if (body && typeof body === "object" && "error" in body && body.error && typeof body.error === "object") {
      const e = (body as ApiErrorBody).error;
      throw new AnalyzeError(e.code, e.message, e.detail);
    }
    throw new AnalyzeError(ANALYZE_ERRORS.UNKNOWN.code, ANALYZE_ERRORS.UNKNOWN.message, `HTTP ${res.status}`);
  }
  return await res.json() as AnalysisResult;
}
