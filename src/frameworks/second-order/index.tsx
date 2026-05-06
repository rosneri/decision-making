"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, EditableList } from "@/components/ui";
import { meta, schema, sample, type SecondOrder } from "./data";
export { meta, schema, sample };
export type { SecondOrder };

const ORDERS: Array<{ key: "firstOrder" | "secondOrder" | "thirdOrder"; label: string; q: string; testId: string; accent?: boolean }> = [
  { key: "firstOrder", label: "1st order", q: "the immediate, intended effect", testId: "order-1" },
  { key: "secondOrder", label: "2nd order", q: "and then what happens?", testId: "order-2", accent: true },
  { key: "thirdOrder", label: "3rd order", q: "and then?", testId: "order-3" },
];

export function View({ data, onUpdate }: { data: SecondOrder; onUpdate?: (d: SecondOrder) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: SecondOrder) => { setS(n); onUpdate?.(n); };

  return (
    <Card>
      <div className="border-b border-rule p-4">
        <MicroLabel>Action</MicroLabel>
        <InlineText value={s.action} onChange={(v) => upd({ ...s, action: v })} className="block w-full mt-1 font-medium text-[16px]" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-rule">
        {ORDERS.map(({ key, label, q, testId, accent }) => (
          <div key={key} data-testid={testId} className={`p-4 ${accent ? "bg-vermilion/5" : ""}`}>
            <MicroLabel accent={accent} bold>{label}</MicroLabel>
            <p className="font-serif italic text-[12px] text-ink-muted mt-0.5">{q}</p>
            <div className="mt-2">
              <EditableList
                items={s[key]}
                testIdPrefix={`${testId}-item`}
                onChangeItem={(i, v) => upd({ ...s, [key]: s[key].map((x, j) => j === i ? v : x) })}
                onRemove={(i) => upd({ ...s, [key]: s[key].filter((_, j) => j !== i) })}
                onAdd={() => upd({ ...s, [key]: [...s[key], ""] })}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
