"use client";

import type { ReactNode } from "react";
import { MicroLabel } from "./MicroLabel";

export interface Quadrant {
  key: string;
  roman: string;
  label: string;
  sub?: string;
  position: 0 | 1 | 2 | 3;
  placeholder?: string;
}

const POS_BORDER = [
  "border-b border-b-rule border-r border-r-rule",
  "border-b border-b-rule",
  "border-r border-r-rule",
  "",
];

export function QuadrantBoard({
  axes,
  quadrants,
  renderBody,
}: {
  axes: { top: string; bottom: string; left: string; right: string };
  quadrants: Quadrant[];
  renderBody: (q: Quadrant) => ReactNode;
}) {
  const labelCls = "absolute bg-paper px-2 whitespace-nowrap";
  return (
    <div className="border border-ink grid grid-cols-2 bg-paper relative">
      <MicroLabel className={`${labelCls} top-[-7px] left-1/2 -translate-x-1/2`}>{axes.top}</MicroLabel>
      <MicroLabel className={`${labelCls} bottom-[-7px] left-1/2 -translate-x-1/2`}>{axes.bottom}</MicroLabel>
      <MicroLabel className={`${labelCls} top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 -rotate-90 origin-center`}>
        {axes.left}
      </MicroLabel>
      <MicroLabel className={`${labelCls} top-1/2 right-0 translate-x-1/2 -translate-y-1/2 rotate-90 origin-center`}>
        {axes.right}
      </MicroLabel>

      {quadrants.map((q) => (
        <div
          key={q.key}
          data-quadrant={q.key}
          className={`p-3 sm:p-6 min-h-[140px] sm:min-h-[220px] flex flex-col ${POS_BORDER[q.position]}`}
        >
          <QuadrantHeader roman={q.roman} label={q.label} {...(q.sub ? { sub: q.sub } : {})} />
          {renderBody(q)}
        </div>
      ))}
    </div>
  );
}

export function QuadrantHeader({ roman, label, sub }: { roman: string; label: string; sub?: string }) {
  return (
    <div className="flex items-baseline gap-2.5 mb-3">
      <span className="font-serif font-medium text-[22px] text-vermilion">{roman}.</span>
      <span className="font-code text-[11px] tracking-[0.22em] uppercase font-medium text-ink">{label}</span>
      {sub && (
        <span className="hidden sm:inline font-code text-[10px] tracking-[0.18em] uppercase text-ink-muted ml-auto">{sub}</span>
      )}
    </div>
  );
}
