"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, EditableList } from "@/components/ui";
import { meta, schema, sample, type Pestel, FACTORS } from "./data";
export { meta, schema, sample };
export type { Pestel };

export function View({ data, onUpdate }: { data: Pestel; onUpdate?: (d: Pestel) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Pestel) => { setS(n); onUpdate?.(n); };

  return (
    <Card>
      <div className="border-b border-rule p-4">
        <MicroLabel>Context</MicroLabel>
        <InlineText value={s.context} onChange={(v) => upd({ ...s, context: v })} className="block w-full mt-1 font-medium text-[16px]" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-x divide-y divide-rule">
        {FACTORS.map((k) => (
          <div key={k} data-testid={`pestel-${k}`} className="p-4">
            <div className="flex items-baseline gap-2">
              <span className="font-serif font-medium text-[24px] text-vermilion">{k[0]}</span>
              <MicroLabel bold>{k}</MicroLabel>
            </div>
            <div className="mt-2">
              <EditableList
                items={s.factors[k]}
                testIdPrefix={`pestel-${k}-item`}
                onChangeItem={(i, v) => upd({ ...s, factors: { ...s.factors, [k]: s.factors[k].map((x, j) => j === i ? v : x) } })}
                onRemove={(i) => upd({ ...s, factors: { ...s.factors, [k]: s.factors[k].filter((_, j) => j !== i) } })}
                onAdd={() => upd({ ...s, factors: { ...s.factors, [k]: [...s.factors[k], ""] } })}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
