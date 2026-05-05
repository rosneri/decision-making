"use client";
import { useState } from "react";
import { Card, MicroLabel } from "@/components/ui";
import { meta, schema, sample, type Pdca, PHASES, META } from "./data";
export { meta, schema, sample };
export type { Pdca };

export function View({ data, onUpdate }: { data: Pdca; onUpdate?: (d: Pdca) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Pdca) => { setS(n); onUpdate?.(n); };

  const advance = () => {
    const i = PHASES.indexOf(s.current);
    if (i === PHASES.length - 1) {
      upd({ ...s, current: "P", cycleNumber: s.cycleNumber + 1 });
    } else {
      upd({ ...s, current: PHASES[i + 1]! });
    }
  };

  return (
    <Card>
      <div className="border-b border-rule p-4 flex items-center justify-between">
        <MicroLabel>
          Cycle <span className="text-vermilion font-medium" data-testid="pdca-cycle-number">{s.cycleNumber}</span>
        </MicroLabel>
        <button
          onClick={advance}
          data-testid="pdca-advance"
          className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted hover:text-vermilion border border-rule px-3 py-1"
        >
          Advance →
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-rule">
        {PHASES.map((k) => {
          const isCurrent = s.current === k;
          return (
            <div key={k} data-testid={`pdca-phase-${k}`} className={`p-4 flex flex-col gap-2 ${isCurrent ? "bg-vermilion/5" : ""}`}>
              <div className="flex items-baseline gap-2">
                <span className={`font-serif font-medium text-[28px] ${isCurrent ? "text-vermilion" : "text-ink"}`}>{k}.</span>
                <MicroLabel>{META[k].word}</MicroLabel>
              </div>
              <span className="font-serif italic text-[12px] text-ink-muted">{META[k].note}</span>
              <textarea
                value={s.phases[k]}
                onChange={(e) => upd({ ...s, phases: { ...s.phases, [k]: e.target.value } })}
                className="mt-1 w-full font-serif text-[14px] bg-transparent border-t border-rule pt-2 outline-none focus:border-vermilion text-ink resize-none"
                rows={4}
              />
            </div>
          );
        })}
      </div>
    </Card>
  );
}
