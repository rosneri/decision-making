"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, EditableList } from "@/components/ui";
import { meta, schema, sample, type Daci } from "./data";
export { meta, schema, sample };
export type { Daci };

export function View({ data, onUpdate }: { data: Daci; onUpdate?: (d: Daci) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Daci) => { setS(n); onUpdate?.(n); };

  return (
    <Card>
      <div className="border-b border-rule p-4">
        <MicroLabel>Decision</MicroLabel>
        <InlineText value={s.decision} onChange={(v) => upd({ ...s, decision: v })} className="block w-full mt-1 font-serif text-[16px]" />
        <div className="mt-2 flex items-center gap-2">
          <MicroLabel>Deadline</MicroLabel>
          <InlineText value={s.deadline} onChange={(v) => upd({ ...s, deadline: v })} className="font-code text-[13px] text-vermilion" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-y divide-rule">
        <div data-testid="daci-driver" className="p-4 bg-vermilion/5">
          <MicroLabel accent bold>D · Driver</MicroLabel>
          <p className="font-serif italic text-[12px] text-ink-muted mt-0.5">runs the process · exactly one</p>
          <InlineText value={s.driver} onChange={(v) => upd({ ...s, driver: v })} className="block w-full mt-2 font-serif font-medium text-[18px]" />
        </div>
        <div data-testid="daci-approver" className="p-4 bg-vermilion/5">
          <MicroLabel accent bold>A · Approver</MicroLabel>
          <p className="font-serif italic text-[12px] text-ink-muted mt-0.5">final say · exactly one</p>
          <InlineText value={s.approver} onChange={(v) => upd({ ...s, approver: v })} className="block w-full mt-2 font-serif font-medium text-[18px]" />
        </div>
        <div data-testid="daci-contributors" className="p-4">
          <MicroLabel>C · Contributors</MicroLabel>
          <p className="font-serif italic text-[12px] text-ink-muted mt-0.5">consulted · provide input</p>
          <div className="mt-2">
            <EditableList
              items={s.contributors}
              testIdPrefix="daci-contrib"
              onChangeItem={(i, v) => upd({ ...s, contributors: s.contributors.map((x, j) => j === i ? v : x) })}
              onRemove={(i) => upd({ ...s, contributors: s.contributors.filter((_, j) => j !== i) })}
              onAdd={() => upd({ ...s, contributors: [...s.contributors, ""] })}
            />
          </div>
        </div>
        <div data-testid="daci-informed" className="p-4">
          <MicroLabel>I · Informed</MicroLabel>
          <p className="font-serif italic text-[12px] text-ink-muted mt-0.5">told after the fact</p>
          <div className="mt-2">
            <EditableList
              items={s.informed}
              testIdPrefix="daci-informed-item"
              onChangeItem={(i, v) => upd({ ...s, informed: s.informed.map((x, j) => j === i ? v : x) })}
              onRemove={(i) => upd({ ...s, informed: s.informed.filter((_, j) => j !== i) })}
              onAdd={() => upd({ ...s, informed: [...s.informed, ""] })}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
