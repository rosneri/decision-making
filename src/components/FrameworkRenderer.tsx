"use client";

import { type FrameworkResult, VIEWS } from "@/frameworks";

export function FrameworkRenderer({ result }: { result: FrameworkResult }) {
  return (
    <div className="space-y-6">
      {renderView(result)}

      <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-5">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs uppercase tracking-wide text-neutral-500">
            AI Recommendation
          </div>
          {result.category && (
            <span className="text-xs px-2 py-0.5 rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400">
              {result.category}
            </span>
          )}
        </div>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {result.recommendation}
        </p>
      </div>
    </div>
  );
}

function renderView(result: FrameworkResult) {
  switch (result.framework) {
    case "decision_matrix": {
      const V = VIEWS.decision_matrix;
      return <V data={result} />;
    }
    case "eisenhower": {
      const V = VIEWS.eisenhower;
      return <V data={result} />;
    }
    case "swot": {
      const V = VIEWS.swot;
      return <V data={result} />;
    }
  }
}
