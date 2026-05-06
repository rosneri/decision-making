"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, RemoveButton, AddButton } from "@/components/ui";
import { meta, schema, sample, LABELS, type NineBox } from "./data";
export { meta, schema, sample };
export type { NineBox };

export function View({ data, onUpdate }: { data: NineBox; onUpdate?: (d: NineBox) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: NineBox) => { setS(n); onUpdate?.(n); };
  const set = (i: number, patch: Partial<NineBox["people"][number]>) =>
    upd({ ...s, people: s.people.map((p, j) => j === i ? { ...p, ...patch } : p) });

  const cell = (perf: number, pot: number) =>
    s.people.map((p, i) => ({ p, i })).filter(({ p }) => p.performance === perf && p.potential === pot);

  return (
    <Card>
      <div className="border-b border-rule p-4 flex items-center gap-2">
        <MicroLabel>x: Performance →</MicroLabel>
        <span className="ml-auto" />
        <MicroLabel>y: Potential ↑</MicroLabel>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-3 grid-rows-3 gap-2">
          {[2, 1, 0].map((pot) =>
            [0, 1, 2].map((perf) => {
              const items = cell(perf, pot);
              const isStar = perf === 2 && pot === 2;
              return (
                <div
                  key={`${perf}-${pot}`}
                  data-testid={`box-${perf}-${pot}`}
                  className={`min-h-[110px] p-2 border border-rule ${isStar ? "border-vermilion bg-vermilion/5" : ""}`}
                >
                  <div className={`font-code text-[10px] tracking-[0.22em] uppercase ${isStar ? "text-vermilion" : "text-ink-muted"}`}>{LABELS[pot]![perf]}</div>
                  <ul className="mt-1 space-y-1">
                    {items.map(({ p, i }) => (
                      <li key={i} className="font-serif text-[13px]">{p.name}</li>
                    ))}
                  </ul>
                </div>
              );
            })
          )}
        </div>
      </div>
      <div className="border-t border-rule">
        {s.people.map((p, i) => (
          <div key={i} data-testid={`box-row-${i}`} className="grid grid-cols-[2fr_2fr_1fr_1fr_2fr_24px] gap-2 items-center p-3 border-b border-rule group">
            <InlineText value={p.name} onChange={(v) => set(i, { name: v })} className="font-medium" />
            <InlineText value={p.role} onChange={(v) => set(i, { role: v })} italic size="sm" className="text-ink-muted" />
            <label className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">
              perf
              <select
                value={p.performance}
                onChange={(e) => set(i, { performance: Number(e.target.value) as 0 | 1 | 2 })}
                data-testid={`box-perf-${i}`}
                className="ml-1 font-code text-[12px] bg-transparent border-b border-rule outline-none"
              >
                <option value={0}>low</option>
                <option value={1}>mid</option>
                <option value={2}>high</option>
              </select>
            </label>
            <label className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">
              pot
              <select
                value={p.potential}
                onChange={(e) => set(i, { potential: Number(e.target.value) as 0 | 1 | 2 })}
                data-testid={`box-pot-${i}`}
                className="ml-1 font-code text-[12px] bg-transparent border-b border-rule outline-none"
              >
                <option value={0}>low</option>
                <option value={1}>mid</option>
                <option value={2}>high</option>
              </select>
            </label>
            <InlineText value={p.note} onChange={(v) => set(i, { note: v })} italic size="sm" className="text-ink-muted" />
            <RemoveButton onClick={() => upd({ ...s, people: s.people.filter((_, j) => j !== i) })} showOnHover />
          </div>
        ))}
        <div className="p-3">
          <AddButton onClick={() => upd({ ...s, people: [...s.people, { name: "", role: "", performance: 1, potential: 1, note: "" }] })}>
            + add person
          </AddButton>
        </div>
      </div>
    </Card>
  );
}
