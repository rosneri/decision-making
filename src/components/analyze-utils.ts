import type { FrameworkId, FrameworkResult } from "@/frameworks";
import type { BiasFinding } from "@/biases";
import { ANALYZE_ERRORS, type ApiErrorBody } from "@/lib/errors";

export type FrameworkAlternative = { id: FrameworkId; name: string; reason: string };
export type AnalysisResult = FrameworkResult & {
  altFrameworks?: FrameworkAlternative[];
  biasFindings?: BiasFinding[];
  explanation?: string;
};

// Framework views, modify and chat-fill all hand back a bare framework object
// (the schema strips advisory fields). Re-attach the note, the alternative
// frameworks and the bias findings from the previous result so they survive
// every edit path.
export function keepAdvisory(prev: AnalysisResult | null, next: FrameworkResult): AnalysisResult {
  if (!prev) return next;
  return {
    ...next,
    recommendation: prev.recommendation,
    ...(prev.altFrameworks ? { altFrameworks: prev.altFrameworks } : {}),
    ...(prev.biasFindings ? { biasFindings: prev.biasFindings } : {}),
  };
}

function safeStringify(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  try { return JSON.stringify(v); } catch { return Object.prototype.toString.call(v); }
}

export class AnalyzeError extends Error {
  code: string;
  detail: string | undefined;
  constructor(code: unknown, message: unknown, detail?: unknown) {
    super(typeof message === "string" ? message : safeStringify(message));
    this.code = typeof code === "string" ? code : safeStringify(code);
    this.detail = detail === undefined
      ? undefined
      : (typeof detail === "string" ? detail : safeStringify(detail));
  }
}

export async function fetchAnalysis(
  decisionText: string,
  opts?: { frameworkId?: FrameworkId },
): Promise<AnalysisResult> {
  let res: Response;
  try {
    res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ decisionText, frameworkId: opts?.frameworkId }),
    });
  } catch (e) {
    throw new AnalyzeError(
      ANALYZE_ERRORS.UPSTREAM.code,
      ANALYZE_ERRORS.UPSTREAM.message,
      e instanceof Error ? e.message : safeStringify(e),
    );
  }

  if (!res.ok) {
    let body: unknown = null;
    try { body = await res.json(); } catch { /* body wasn't JSON */ }
    if (body && typeof body === "object") {
      const errField = (body as { error?: unknown }).error;
      // New shape: { error: { code, message, detail } }
      if (errField && typeof errField === "object") {
        const e = errField as Partial<ApiErrorBody["error"]>;
        throw new AnalyzeError(
          e.code ?? ANALYZE_ERRORS.UNKNOWN.code,
          e.message ?? ANALYZE_ERRORS.UNKNOWN.message,
          e.detail,
        );
      }
      // Legacy shape: { error: "string" }
      if (typeof errField === "string") {
        throw new AnalyzeError(ANALYZE_ERRORS.UNKNOWN.code, errField);
      }
    }
    throw new AnalyzeError(
      ANALYZE_ERRORS.UNKNOWN.code,
      ANALYZE_ERRORS.UNKNOWN.message,
      `HTTP ${res.status}`,
    );
  }
  return await res.json() as AnalysisResult;
}
