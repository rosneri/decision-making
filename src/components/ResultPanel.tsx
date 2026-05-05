"use client";

import { createContext, useContext, type ReactNode } from "react";

interface Metric {
  k: string;
  v: string;
  testId?: string;
}

interface Props {
  body: string;
  label?: string;
  metrics?: Metric[];
}

interface RerecommendValue {
  loading: boolean;
  error: boolean;
  show: boolean;
  onRerecommend: () => void;
  /** Authoritative recommendation text from the parent. Overrides the
   *  view's local prop so re-recommend results render even when the view
   *  holds its own copy of `data` in useState. */
  recommendation?: string;
}

const RerecommendContext = createContext<RerecommendValue | null>(null);

export function RerecommendProvider({
  value,
  children,
}: {
  value: RerecommendValue;
  children: ReactNode;
}) {
  return <RerecommendContext.Provider value={value}>{children}</RerecommendContext.Provider>;
}

export function ResultPanel({ body, label = "Recommendation", metrics }: Props) {
  const rerec = useContext(RerecommendContext);
  const text = rerec?.recommendation ?? body;
  if (!text) return null;

  return (
    <div
      data-testid="framework-result"
      className="border-t border-vermilion bg-vermilion/5 px-6 py-5"
    >
      <div className="flex items-baseline gap-4 mb-2">
        <span className="font-code text-[11px] tracking-[0.22em] uppercase text-vermilion font-medium">
          {label}
        </span>
        {rerec?.show && (
          <button
            onClick={rerec.onRerecommend}
            disabled={rerec.loading}
            className="ml-3 font-serif italic text-[12px] text-vermilion border-b border-vermilion pb-px bg-transparent border-t-0 border-l-0 border-r-0 p-0 cursor-pointer hover:text-vermilion-deep hover:border-vermilion-deep transition-colors duration-200 disabled:opacity-60 disabled:cursor-default"
          >
            {rerec.loading ? "Re-recommending…" : rerec.error ? "Try again →" : "Re-recommend →"}
          </button>
        )}
        {metrics && metrics.length > 0 && (
          <span className="ml-auto flex items-baseline gap-5 flex-wrap justify-end">
            {metrics.map((m) => (
              <span key={m.k} className="inline-flex items-baseline gap-2">
                <span className="font-code text-[11px] tracking-[0.22em] uppercase text-ink-muted">
                  {m.k}
                </span>
                <span
                  data-testid={m.testId}
                  className="font-code text-[11px] tracking-[0.06em] uppercase font-medium text-ink"
                >
                  {m.v}
                </span>
              </span>
            ))}
          </span>
        )}
      </div>
      <p className="font-serif text-[15px] leading-7 text-ink max-w-[68ch]">{text}</p>
    </div>
  );
}
