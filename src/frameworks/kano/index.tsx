"use client";
import { useState } from "react";
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
    <div className="border border-ink bg-paper">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-rule">
        {CATS.map((c) => {
          const items = s.features.map((f, i) => ({ f, i })).filter(({ f }) => f.category === c);
          return (
            <div key={c} data-testid={`kano-bucket-${c}`} className="p-4 min-h-[180px]">
              <span className={`font-code text-[10px] tracking-[0.22em] uppercase font-medium ${CAT_META[c].color.split(" ")[1]}`}>
                {CAT_META[c].label}
              </span>
              <ul className="mt-2 space-y-1">
                {items.map(({ f, i }) => (
                  <li key={i} className="flex items-center gap-1 group">
                    <span className="font-serif text-[14px] text-ink flex-1">{f.name}</span>
                    <button onClick={() => rm(i)} aria-label="remove"
                      className="opacity-0 group-hover:opacity-100 text-ink-muted hover:text-vermilion">×</button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <div className="border-t border-rule p-4">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">All features</span>
        <ul className="mt-2 space-y-1">
          {s.features.map((f, i) => (
            <li key={i} className="flex items-center gap-2">
              <input value={f.name} onChange={(e) => set(i, { name: e.target.value })}
                className="flex-1 font-serif italic text-[14px] bg-transparent border-b border-rule outline-none focus:border-vermilion py-0.5" />
              <select value={f.category} onChange={(e) => set(i, { category: e.target.value as Cat })}
                aria-label={`category for ${f.name}`}
                className="font-code text-[10px] tracking-[0.18em] uppercase bg-transparent border border-rule px-2 py-1">
                {CATS.map((c) => <option key={c} value={c}>{CAT_META[c].label}</option>)}
              </select>
              <button onClick={() => rm(i)} aria-label="remove" className="text-ink-muted hover:text-vermilion">×</button>
            </li>
          ))}
        </ul>
        <button onClick={add} className="mt-3 font-serif italic text-[13px] text-ink-muted hover:text-vermilion">+ add feature</button>
      </div>
    </div>
  );
}
