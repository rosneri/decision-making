"use client";

const TRACK = "appearance-none bg-ink-muted outline-none cursor-pointer";
const THUMB =
  "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-vermilion " +
  "[&::-moz-range-thumb]:w-2.5 [&::-moz-range-thumb]:h-2.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-vermilion [&::-moz-range-thumb]:border-none";

export function Range({
  value,
  onChange,
  min = 0,
  max = 10,
  step = 1,
  className = "",
  ariaLabel,
  testId,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  ariaLabel?: string;
  testId?: string;
}) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      {...(ariaLabel ? { "aria-label": ariaLabel } : {})}
      {...(testId ? { "data-testid": testId } : {})}
      className={`h-px w-full ${TRACK} ${THUMB} ${className}`}
    />
  );
}

export function RangeField({
  label,
  value,
  onChange,
  min = 0,
  max = 10,
  step = 1,
  accent = false,
  suffix,
  ariaLabel,
  testId,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  accent?: boolean;
  suffix?: string;
  ariaLabel?: string;
  testId?: string;
}) {
  return (
    <label className="block">
      <span
        className={`font-code text-[10px] tracking-[0.22em] uppercase ${accent ? "text-vermilion font-medium" : "text-ink-muted"}`}
      >
        {label}
      </span>
      <Range
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        ariaLabel={ariaLabel ?? label}
        {...(testId ? { testId } : {})}
        className="mt-2"
      />
      <span className={`font-code text-[11px] mt-1 block ${accent ? "text-vermilion" : "text-ink-muted"}`}>
        {value}
        {suffix ?? `/${max}`}
      </span>
    </label>
  );
}
