"use client";

export function BigNumber({
  value,
  onChange,
  min,
  max,
  step,
  size = "md",
  accent = false,
  width = "w-full",
  className = "",
  ariaLabel,
  testId,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: "sm" | "md" | "lg" | "xl";
  accent?: boolean;
  width?: string;
  className?: string;
  ariaLabel?: string;
  testId?: string;
}) {
  const sizeCls =
    size === "sm" ? "text-[16px]"
      : size === "md" ? "text-[20px]"
        : size === "lg" ? "text-[24px]"
          : "text-[28px]";
  const tone = accent ? "text-vermilion" : "text-ink";
  return (
    <input
      type="number"
      value={value}
      {...(min !== undefined ? { min } : {})}
      {...(max !== undefined ? { max } : {})}
      {...(step !== undefined ? { step } : {})}
      onChange={(e) => {
        const n = Number(e.target.value);
        let v = Number.isFinite(n) ? n : 0;
        if (min !== undefined) v = Math.max(min, v);
        if (max !== undefined) v = Math.min(max, v);
        onChange(v);
      }}
      {...(ariaLabel ? { "aria-label": ariaLabel } : {})}
      {...(testId ? { "data-testid": testId } : {})}
      className={`block ${width} font-serif font-medium ${sizeCls} ${tone} bg-transparent border-b border-rule outline-none focus:border-vermilion ${className}`.trim()}
    />
  );
}
