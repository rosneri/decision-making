"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, EditableList } from "@/components/ui";
import { meta, schema, sample, type PmesiiPt, VARS } from "./data";
export { meta, schema, sample };
export type { PmesiiPt };

export function View({ data, onUpdate }: { data: PmesiiPt; onUpdate?: (d: PmesiiPt) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: PmesiiPt) => { setS(n); onUpdate?.(n); };

  return (
    <Card>
      <div className="border-b border-rule p-4">
        <MicroLabel>Area / mission</MicroLabel>
        <InlineText value={s.area} onChange={(v) => upd({ ...s, area: v })} className="block w-full mt-1 font-medium text-[16px]" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-x divide-y divide-rule">
        {VARS.map((k) => (
          <div key={k} data-testid={`pmesii-${k}`} className="p-4">
            <div className="flex items-baseline gap-2">
              <span className="font-serif font-medium text-[20px] text-vermilion">{k[0]}</span>
              <MicroLabel bold>{k}</MicroLabel>
            </div>
            <div className="mt-2">
              <EditableList
                items={s.variables[k]}
                testIdPrefix={`pmesii-${k}-item`}
                onChangeItem={(i, v) => upd({ ...s, variables: { ...s.variables, [k]: s.variables[k].map((x, j) => j === i ? v : x) } })}
                onRemove={(i) => upd({ ...s, variables: { ...s.variables, [k]: s.variables[k].filter((_, j) => j !== i) } })}
                onAdd={() => upd({ ...s, variables: { ...s.variables, [k]: [...s.variables[k], ""] } })}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
