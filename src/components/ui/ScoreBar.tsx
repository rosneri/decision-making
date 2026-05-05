export function ScoreBar({
  value,
  max,
  highlight = false,
  width = "max-w-[180px]",
}: {
  value: number;
  max: number;
  highlight?: boolean;
  width?: string;
}) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  return (
    <div className={`h-1 bg-rule flex-1 relative ${width}`}>
      <div
        className={`absolute inset-y-0 left-0 ${highlight ? "bg-vermilion" : "bg-ink"}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
