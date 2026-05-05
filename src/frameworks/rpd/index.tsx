"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, AddButton, RemoveButton, HeaderBand, VerdictBar, CycleButton } from "@/components/ui";
import { meta, schema, sample, type Rpd } from "./data";

const RPD_STATES = ["yes", "no", "unknown"] as const;
type RpdState = (typeof RPD_STATES)[number];
const RPD_VARIANTS: Record<RpdState, { className: string; label: string }> = {
  yes:     { className: "border-[1.5px] border-ink text-ink font-serif text-[18px] font-medium", label: "✓" },
  no:      { className: "border-[1.5px] border-vermilion text-vermilion bg-vermilion/10 font-serif text-[18px] font-medium", label: "✗" },
  unknown: { className: "border-[1.5px] border-rule text-ink-muted font-serif text-[18px] font-medium", label: "?" },
};
export { meta, schema, sample };
export type { Rpd };

export function View({ data, onUpdate }: { data: Rpd; onUpdate?: (d: Rpd) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Rpd) => { setS(n); onUpdate?.(n); };
  const setCheck = (i: number, patch: Partial<Rpd["checks"][number]>) =>
    upd({ ...s, checks: s.checks.map((c, j) => j === i ? { ...c, ...patch } : c) });
  const addCheck = () => upd({ ...s, checks: [...s.checks, { item: "", state: "unknown" }] });
  const rmCheck = (i: number) => upd({ ...s, checks: s.checks.filter((_, j) => j !== i) });

  const blocked = s.checks.some((c) => c.state === "no");
  const allYes = s.checks.every((c) => c.state === "yes");

  return (
    <Card>
      <HeaderBand label="Pattern · match">
        <InlineText
          value={s.pattern}
          onChange={(v) => upd({ ...s, pattern: v })}
          testId="rpd-pattern"
          italic
          className="block w-full mt-1"
        />
      </HeaderBand>
      <div className="p-4 border-b border-rule">
        <MicroLabel>First workable course</MicroLabel>
        <InlineText
          value={s.course}
          onChange={(v) => upd({ ...s, course: v })}
          size="lg"
          className="block w-full mt-1"
        />
      </div>
      <div className="p-4">
        <MicroLabel>Will it work?</MicroLabel>
        <ul className="mt-3 space-y-1">
          {s.checks.map((c, i) => (
            <li key={i} className="flex items-center gap-3 group" data-testid={`rpd-check-${i}`}>
              <CycleButton
                value={c.state as RpdState}
                states={RPD_STATES}
                variants={RPD_VARIANTS}
                onCycle={(next) => setCheck(i, { state: next })}
                size={7}
                ariaLabel={`toggle ${c.item}: ${c.state}`}
              />
              <InlineText
                value={c.item}
                onChange={(v) => setCheck(i, { item: v })}
                size="sm"
                className="border-b border-rule"
              />
              <RemoveButton onClick={() => rmCheck(i)} ariaLabel="remove" showOnHover />
            </li>
          ))}
        </ul>
        <AddButton onClick={addCheck} className="mt-2">+ check</AddButton>
      </div>
      <VerdictBar alarm={!blocked} testId="rpd-verdict">
        {blocked ? "Hold — find another course" : allYes ? "Execute" : "Execute (with risk noted)"}
      </VerdictBar>
    </Card>
  );
}
