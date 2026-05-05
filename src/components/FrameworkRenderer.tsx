"use client";

import type { FrameworkResult } from "@/lib/schemas";
import { DecisionMatrixView } from "./DecisionMatrix";
import { EisenhowerView } from "./EisenhowerMatrix";
import { SwotView } from "./SwotAnalysis";

export function FrameworkRenderer({ result }: { result: FrameworkResult }) {
  return (
    <div className="space-y-6">
      {result.framework === "decision_matrix" && (
        <DecisionMatrixView data={result} />
      )}
      {result.framework === "eisenhower" && <EisenhowerView data={result} />}
      {result.framework === "swot" && <SwotView data={result} />}

      <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-5">
        <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">
          AI Recommendation
        </div>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {result.recommendation}
        </p>
      </div>
    </div>
  );
}
