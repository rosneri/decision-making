"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, EditableList } from "@/components/ui";
import { meta, schema, sample, type Aar, META } from "./data";
export { meta, schema, sample };
export type { Aar };

export function View({ data, onUpdate }: { data: Aar; onUpdate?: (d: Aar) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Aar) => { setS(n); onUpdate?.(n); };

  return (
    <Card>
      <div className="border-b border-rule p-4">
        <MicroLabel>Event</MicroLabel>
        <InlineText
          value={s.event}
          onChange={(v) => upd({ ...s, event: v })}
          className="block w-full mt-1 font-medium text-[16px]"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-y divide-rule">
        <div data-testid="aar-intended" className="p-4">
          <MicroLabel>{META.intended.label}</MicroLabel>
          <textarea
            value={s.intended}
            onChange={(e) => upd({ ...s, intended: e.target.value })}
            className="mt-2 w-full font-serif text-[14px] bg-transparent border-t border-rule pt-2 outline-none focus:border-vermilion text-ink resize-none"
            rows={4}
          />
        </div>
        <div data-testid="aar-actual" className="p-4">
          <MicroLabel accent bold>{META.actual.label}</MicroLabel>
          <textarea
            value={s.actual}
            onChange={(e) => upd({ ...s, actual: e.target.value })}
            className="mt-2 w-full font-serif text-[14px] bg-transparent border-t border-rule pt-2 outline-none focus:border-vermilion text-ink resize-none"
            rows={4}
          />
        </div>
        <div data-testid="aar-why" className="p-4">
          <MicroLabel>{META.why.label}</MicroLabel>
          <p className="font-serif italic text-[12px] text-ink-muted mt-0.5">{META.why.q}</p>
          <div className="mt-2">
            <EditableList
              items={s.why}
              testIdPrefix="aar-why-item"
              onChangeItem={(i, v) => upd({ ...s, why: s.why.map((x, j) => j === i ? v : x) })}
              onRemove={(i) => upd({ ...s, why: s.why.filter((_, j) => j !== i) })}
              onAdd={() => upd({ ...s, why: [...s.why, ""] })}
            />
          </div>
        </div>
        <div data-testid="aar-next" className="p-4 bg-vermilion/5">
          <MicroLabel accent bold>{META.next.label}</MicroLabel>
          <p className="font-serif italic text-[12px] text-ink-muted mt-0.5">{META.next.q}</p>
          <div className="mt-2">
            <EditableList
              items={s.next}
              testIdPrefix="aar-next-item"
              onChangeItem={(i, v) => upd({ ...s, next: s.next.map((x, j) => j === i ? v : x) })}
              onRemove={(i) => upd({ ...s, next: s.next.filter((_, j) => j !== i) })}
              onAdd={() => upd({ ...s, next: [...s.next, ""] })}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
