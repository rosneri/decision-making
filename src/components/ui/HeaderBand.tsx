import type { ReactNode } from "react";
import { MicroLabel } from "./MicroLabel";

export function HeaderBand({
  label,
  accent = true,
  bordered = true,
  className = "",
  align = "left",
  testId,
  children,
}: {
  label: ReactNode;
  accent?: boolean;
  bordered?: boolean;
  className?: string;
  align?: "left" | "center";
  testId?: string;
  children?: ReactNode;
}) {
  const tone = accent
    ? `bg-vermilion/5 ${bordered ? "border-b border-vermilion" : ""}`
    : `bg-paper-deep ${bordered ? "border-b border-rule" : ""}`;
  return (
    <div
      {...(testId ? { "data-testid": testId } : {})}
      className={`p-4 ${tone} ${align === "center" ? "text-center" : ""} ${className}`.trim()}
    >
      <MicroLabel accent={accent} bold={accent}>{label}</MicroLabel>
      {children}
    </div>
  );
}
