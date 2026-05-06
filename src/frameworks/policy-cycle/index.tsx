"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText } from "@/components/ui";
import { meta, schema, sample, type PolicyCycle, STAGES, META } from "./data";
export { meta, schema, sample };
export type { PolicyCycle };

export function View({ data, onUpdate }: { data: PolicyCycle; onUpdate?: (d: PolicyCycle) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: PolicyCycle) => { setS(n); onUpdate?.(n); };

  return (
    <Card>
      <div className="border-b border-rule p-4">
        <MicroLabel>Problem</MicroLabel>
        <InlineText value={s.problem} onChange={(v) => upd({ ...s, problem: v })} className="block w-full mt-1 font-serif text-[15px]" />
      </div>
      <div>
        {STAGES.map((k, idx) => {
          const active = s.current === k;
          return (
            <div
              key={k}
              data-testid={`pc-${k}`}
              className={`border-b border-rule p-4 grid grid-cols-[40px_1fr] gap-4 items-start cursor-pointer ${active ? "bg-vermilion/5" : ""}`}
              onClick={() => upd({ ...s, current: k })}
            >
              <span className={`font-serif font-medium text-[28px] ${active ? "text-vermilion" : "text-ink-muted"}`}>{idx + 1}.</span>
              <div>
                <MicroLabel accent={active} bold={active}>{META[k].word}</MicroLabel>
                <p className="font-serif italic text-[12px] text-ink-muted mt-0.5">{META[k].q}</p>
                <textarea
                  value={s.stages[k]}
                  onChange={(e) => upd({ ...s, stages: { ...s.stages, [k]: e.target.value } })}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-2 w-full font-serif text-[13px] bg-transparent border-t border-rule pt-2 outline-none focus:border-vermilion text-ink resize-none"
                  rows={2}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
