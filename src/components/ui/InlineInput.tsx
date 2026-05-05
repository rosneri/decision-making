"use client";

import type { CSSProperties } from "react";

const BASE_TEXT =
  "border-none bg-transparent outline-none font-serif text-ink border-b border-transparent focus:border-vermilion transition-colors duration-200 py-0";

export function InlineText({
  value,
  onChange,
  placeholder,
  size = "base",
  italic = false,
  className = "",
  ariaLabel,
  testId,
  fullWidth = true,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  size?: "sm" | "base" | "lg";
  italic?: boolean;
  className?: string;
  ariaLabel?: string;
  testId?: string;
  fullWidth?: boolean;
}) {
  const sizeCls = size === "sm" ? "text-[13px]" : size === "lg" ? "text-[17px]" : "text-base";
  const italicCls = italic ? "italic" : "";
  const widthCls = fullWidth ? "flex-1 min-w-0 w-full" : "";
  const placeholderCls = "placeholder:text-ink-muted placeholder:italic";
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      {...(placeholder ? { placeholder } : {})}
      {...(ariaLabel ? { "aria-label": ariaLabel } : {})}
      {...(testId ? { "data-testid": testId } : {})}
      className={`${BASE_TEXT} ${sizeCls} ${italicCls} ${widthCls} ${placeholderCls} ${className}`.trim()}
    />
  );
}

const NUMBER_BASE =
  "font-code text-center bg-transparent border-none outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

export function InlineNumber({
  value,
  onChange,
  min,
  max,
  step,
  width = "w-12",
  size = "base",
  accent = false,
  className = "",
  ariaLabel,
  testId,
  onMouseDown,
  title,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  width?: string;
  size?: "sm" | "base" | "lg";
  accent?: boolean;
  className?: string;
  ariaLabel?: string;
  testId?: string;
  onMouseDown?: (e: React.MouseEvent<HTMLInputElement>) => void;
  title?: string;
}) {
  const sizeCls = size === "sm" ? "text-[13px]" : size === "lg" ? "text-base font-medium" : "text-[15px]";
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
      {...(onMouseDown ? { onMouseDown } : {})}
      {...(ariaLabel ? { "aria-label": ariaLabel } : {})}
      {...(testId ? { "data-testid": testId } : {})}
      {...(title ? { title } : {})}
      className={`${NUMBER_BASE} ${sizeCls} ${tone} ${width} ${className}`.trim()}
    />
  );
}

export const inlineInputStyle: CSSProperties = {};
