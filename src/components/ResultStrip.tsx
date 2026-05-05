export interface Metric {
  k: string;
  v: string;
  testId?: string;
}

interface Props {
  label?: string;
  metrics: Metric[];
}

export function ResultStrip({ label = "Result", metrics }: Props) {
  if (!metrics || metrics.length === 0) return null;
  return (
    <div
      data-testid="framework-result"
      className="border-t border-vermilion bg-vermilion/5 px-6 py-3 flex items-baseline gap-5"
    >
      <span className="font-code text-[11px] tracking-[0.22em] uppercase text-vermilion font-medium">
        {label}
      </span>
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
    </div>
  );
}
