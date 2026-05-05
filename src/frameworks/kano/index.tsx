"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, AddButton, RemoveButton } from "@/components/ui";
import { meta, schema, sample, type Kano, CATS, type Cat, CAT_META } from "./data";
export { meta, schema, sample };
export type { Kano };

export function View({ data, onUpdate }: { data: Kano; onUpdate?: (d: Kano) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Kano) => { setS(n); onUpdate?.(n); };
  const set = (i: number, patch: Partial<Kano["features"][number]>) =>
    upd({ ...s, features: s.features.map((f, j) => j === i ? { ...f, ...patch } : f) });
  const add = () => upd({ ...s, features: [...s.features, { name: "feature", category: "performance" }] });
  const rm = (i: number) => upd({ ...s, features: s.features.filter((_, j) => j !== i) });

  return (
    <Card>
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-rule">
        {CATS.map((c) => {
          const items = s.features.map((f, i) => ({ f, i })).filter(({ f }) => f.category === c);
          return (
            <div key={c} data-testid={`kano-bucket-${c}`} className="p-4 min-h-[180px]">
              <MicroLabel bold className={CAT_META[c].color.split(" ")[1]}>
                {CAT_META[c].label}
              </MicroLabel>
              <ul className="mt-2 space-y-1">
                {items.map(({ f, i }) => (
                  <li key={i} className="flex items-center gap-1 group">
                    <span className="font-serif text-[14px] text-ink flex-1">{f.name}</span>
                    <RemoveButton onClick={() => rm(i)} ariaLabel="remove" showOnHover />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <div className="border-t border-rule p-4">
        <MicroLabel>All features</MicroLabel>
        <ul className="mt-2 space-y-1">
          {s.features.map((f, i) => (
            <li key={i} className="flex items-center gap-2">
              <InlineText
                value={f.name}
                onChange={(v) => set(i, { name: v })}
                italic
                size="sm"
                className="border-b border-rule py-0.5"
              />
              <select
                value={f.category}
                onChange={(e) => set(i, { category: e.target.value as Cat })}
                aria-label={`category for ${f.name}`}
                className="font-code text-[10px] tracking-[0.18em] uppercase bg-transparent border border-rule px-2 py-1"
              >
                {CATS.map((c) => <option key={c} value={c}>{CAT_META[c].label}</option>)}
              </select>
              <RemoveButton onClick={() => rm(i)} ariaLabel="remove" />
            </li>
          ))}
        </ul>
        <AddButton onClick={add} className="mt-3">+ add feature</AddButton>
      </div>
    </Card>
  );
}
