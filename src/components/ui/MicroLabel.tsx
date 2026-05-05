import type { CSSProperties, ReactNode } from "react";

const BASE = "font-code text-[10px] tracking-[0.22em] uppercase";

export function MicroLabel({
  children,
  accent = false,
  bold = false,
  className = "",
  as = "span",
  style,
}: {
  children: ReactNode;
  accent?: boolean | undefined;
  bold?: boolean | undefined;
  className?: string | undefined;
  as?: "span" | "div" | "label" | undefined;
  style?: CSSProperties | undefined;
}) {
  const Tag = as ?? "span";
  const tone = accent ? "text-vermilion" : "text-ink-muted";
  const weight = bold ? "font-medium" : "";
  return (
    <Tag className={`${BASE} ${tone} ${weight} ${className}`.trim()} {...(style ? { style } : {})}>
      {children}
    </Tag>
  );
}
