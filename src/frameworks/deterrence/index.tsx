"use client";
import { useState } from "react";
import { Card, InlineText, VerdictBar } from "@/components/ui";
import { meta, schema, sample, type Deterrence, COND, type Cond, META, cycleState } from "./data";
export { meta, schema, sample };
export type { Deterrence };

export function View({ data, onUpdate }: { data: Deterrence; onUpdate?: (d: Deterrence) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Deterrence) => { setS(n); onUpdate?.(n); };
  const set = (c: Cond, patch: Partial<Deterrence["conditions"][Cond]>) =>
    upd({ ...s, conditions: { ...s.conditions, [c]: { ...s.conditions[c]!, ...patch } } });

  const weakest = COND.find((c) => s.conditions[c]!.state !== "yes");
  const willHold = !weakest;

  return (
    <Card>
      <ul className="divide-y divide-rule">
        {COND.map((c) => {
          const cd = s.conditions[c]!;
          const failing = cd.state !== "yes";
          return (
            <li
              key={c}
              data-testid={`deterrence-${c}`}
              className={`p-4 grid grid-cols-1 sm:grid-cols-[140px_1fr_120px] gap-2 sm:gap-3 items-start sm:items-center ${failing && c === weakest ? "bg-vermilion/5" : ""}`}
            >
              <div>
                <div className="font-serif text-[15px] font-medium text-ink">{META[c].label}</div>
                <div className="font-serif italic text-[12px] text-ink-muted">{META[c].q}</div>
              </div>
              <InlineText
                value={cd.note}
                onChange={(v) => set(c, { note: v })}
                italic
                size="sm"
                className="border-b border-rule"
              />
              <button
                onClick={() => set(c, { state: cycleState(cd.state) })}
                data-testid={`deterrence-${c}-state`}
                className={`font-code text-[11px] tracking-[0.22em] uppercase font-medium border px-2 py-1 ${
                  cd.state === "yes" ? "border-ink text-ink" : cd.state === "weak" ? "border-vermilion text-vermilion bg-vermilion/10" : "border-vermilion text-paper bg-vermilion"
                }`}
              >
                {cd.state === "yes" ? "✓ yes" : cd.state === "weak" ? "weak" : "✗ no"}
              </button>
            </li>
          );
        })}
      </ul>
      <VerdictBar alarm={!willHold} testId="deterrence-verdict">
        {willHold ? "Deterrence will hold" : `Will fail · weak link: ${META[weakest!].label}`}
      </VerdictBar>
    </Card>
  );
}
