import type { ReactNode } from "react";

export function Card({
  children,
  variant = "framed",
  className = "",
  testId,
}: {
  children: ReactNode;
  variant?: "framed" | "ruled" | "plain";
  className?: string;
  testId?: string;
}) {
  const base =
    variant === "framed"
      ? "border border-ink bg-paper"
      : variant === "ruled"
        ? "border-t-2 border-ink border-b border-b-ink"
        : "";
  return (
    <div
      {...(testId ? { "data-testid": testId } : {})}
      className={`${base} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
