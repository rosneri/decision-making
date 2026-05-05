"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, AddButton, RemoveButton } from "@/components/ui";
import { meta, schema, sample, type Rpd, cycleState } from "./data";
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
      <div className="p-4 border-b border-vermilion bg-vermilion/5">
        <MicroLabel accent bold>Pattern · match</MicroLabel>
        <InlineText
          value={s.pattern}
          onChange={(v) => upd({ ...s, pattern: v })}
          testId="rpd-pattern"
          italic
          className="block w-full mt-1"
        />
      </div>
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
              <button
                onClick={() => setCheck(i, { state: cycleState(c.state) })}
                aria-label={`toggle ${c.item}: ${c.state}`}
                className={`w-7 h-7 grid place-items-center font-serif text-[18px] font-medium border-[1.5px] ${c.state === "yes" ? "border-ink text-ink" : c.state === "no" ? "border-vermilion text-vermilion bg-vermilion/10" : "border-rule text-ink-muted"}`}
              >
                {c.state === "yes" ? "✓" : c.state === "no" ? "✗" : "?"}
              </button>
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
      <div
        className={`p-3 border-t border-ink text-center font-code text-[12px] tracking-[0.22em] uppercase font-medium ${blocked ? "bg-paper-deep text-ink-muted" : "bg-vermilion text-paper"}`}
        data-testid="rpd-verdict"
      >
        {blocked ? "Hold — find another course" : allYes ? "Execute" : "Execute (with risk noted)"}
      </div>
    </Card>
  );
}
