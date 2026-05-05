import type { ReactNode } from "react";

export function VerdictBar({
  alarm,
  children,
  testId,
  topBorder = true,
}: {
  alarm: boolean;
  children: ReactNode;
  testId?: string;
  topBorder?: boolean;
}) {
  const tone = alarm ? "bg-vermilion text-paper" : "bg-paper-deep text-ink";
  const top = topBorder ? "border-t border-ink" : "";
  return (
    <div
      {...(testId ? { "data-testid": testId } : {})}
      className={`p-4 ${top} text-center font-code text-[12px] tracking-[0.22em] uppercase font-medium ${tone}`}
    >
      {children}
    </div>
  );
}
