"use client";

export function DotMeter({
  value,
  max = 5,
  onChange,
  variant = "square",
  size = "md",
  accent = false,
  ariaLabel,
  itemAriaLabel = (n) => `set ${n}`,
}: {
  value: number;
  max?: number;
  onChange?: (n: number) => void;
  variant?: "square" | "dot" | "ring" | "bar";
  size?: "xs" | "sm" | "md";
  accent?: boolean;
  ariaLabel?: string;
  itemAriaLabel?: (n: number) => string;
}) {
  const dim =
    variant === "bar"
      ? size === "xs" ? "w-2 h-4" : "w-2.5 h-5"
      : size === "xs"
        ? "w-2.5 h-2.5"
        : size === "sm"
          ? "w-3 h-3"
          : "w-3.5 h-3.5";
  const round = variant === "dot" || variant === "ring" ? "rounded-full" : "";
  const filled = accent ? "bg-vermilion border-vermilion" : "bg-ink border-ink";
  const filledRing = accent ? "bg-vermilion border-vermilion" : "bg-ink border-ink";
  const emptyRing = accent ? "border-vermilion" : "border-rule";
  const emptyBg = "bg-paper border-rule";
  const fillStyle = variant === "ring" ? filledRing : filled;
  const emptyStyle = variant === "ring" ? `border ${emptyRing}` : `border ${emptyBg}`;

  return (
    <div className="flex gap-1" {...(ariaLabel ? { role: "group", "aria-label": ariaLabel } : {})}>
      {Array.from({ length: max }, (_, i) => {
        const n = i + 1;
        const on = n <= value;
        const cls = `${dim} ${round} ${on ? `border ${fillStyle}` : emptyStyle}`;
        if (!onChange) return <span key={i} className={cls} aria-hidden="true" />;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange(n)}
            aria-label={itemAriaLabel(n)}
            className={`${cls} cursor-pointer p-0`}
          />
        );
      })}
    </div>
  );
}
