"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, EditableList } from "@/components/ui";
import { meta, schema, sample, type Dime, INSTRUMENTS } from "./data";
export { meta, schema, sample };
export type { Dime };

export function View({ data, onUpdate }: { data: Dime; onUpdate?: (d: Dime) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Dime) => { setS(n); onUpdate?.(n); };

  return (
    <Card>
      <div className="border-b border-rule p-4">
        <MicroLabel>Objective</MicroLabel>
        <InlineText
          value={s.objective}
          onChange={(v) => upd({ ...s, objective: v })}
          className="block w-full mt-1 font-serif text-[16px]"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-x divide-y divide-rule">
        {INSTRUMENTS.map((k) => {
          const isLead = s.emphasis === k;
          return (
            <div
              key={k}
              data-testid={`dime-${k}`}
              className={`p-4 cursor-pointer ${isLead ? "bg-vermilion/5" : ""}`}
              onClick={() => upd({ ...s, emphasis: k })}
            >
              <div className="flex items-baseline gap-2">
                <span className={`font-serif font-medium text-[24px] ${isLead ? "text-vermilion" : "text-ink"}`}>{k[0]}</span>
                <MicroLabel accent={isLead} bold={isLead}>{k}</MicroLabel>
              </div>
              <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                <EditableList
                  items={s.instruments[k]}
                  testIdPrefix={`dime-${k}-item`}
                  onChangeItem={(i, v) => upd({ ...s, instruments: { ...s.instruments, [k]: s.instruments[k].map((x, j) => j === i ? v : x) } })}
                  onRemove={(i) => upd({ ...s, instruments: { ...s.instruments, [k]: s.instruments[k].filter((_, j) => j !== i) } })}
                  onAdd={() => upd({ ...s, instruments: { ...s.instruments, [k]: [...s.instruments[k], ""] } })}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
