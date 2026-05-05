"use client";
import { useState } from "react";
import { meta, schema, sample, type Grade, QUAL, type Qual, QUAL_META } from "./data";
export { meta, schema, sample };
export type { Grade };

export function View({ data, onUpdate }: { data: Grade; onUpdate?: (d: Grade) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Grade) => { setS(n); onUpdate?.(n); };
  const set = (i: number, patch: Partial<Grade["studies"][number]>) =>
    upd({ ...s, studies: s.studies.map((x, j) => j === i ? { ...x, ...patch } : x) });
  const add = () => upd({ ...s, studies: [...s.studies, { type: "Study", quality: "moderate" }] });
  const rm = (i: number) => upd({ ...s, studies: s.studies.filter((_, j) => j !== i) });

  return (
    <div className="border border-ink bg-paper">
      <ul className="divide-y divide-rule">
        {s.studies.map((x, i) => (
          <li key={i} data-testid={`grade-study-${i}`}
            className="p-3 grid grid-cols-[1fr_70px_180px_30px] gap-2 items-center">
            <input value={x.type} onChange={(e) => set(i, { type: e.target.value })}
              className="font-serif text-[14px] bg-transparent border-none outline-none text-ink" />
            <input type="number" min={0} value={x.n ?? ""} placeholder="n"
              onChange={(e) => set(i, { n: e.target.value === "" ? undefined : Math.max(0, Number(e.target.value) || 0) })}
              className="font-code text-[12px] w-16 text-center bg-transparent border-b border-rule outline-none text-ink-muted" />
            <select value={x.quality} onChange={(e) => set(i, { quality: e.target.value as Qual })}
              aria-label={`quality for ${x.type}`}
              className="font-code text-[10px] tracking-[0.18em] uppercase bg-transparent border border-rule px-2 py-1">
              {QUAL.map((q) => <option key={q} value={q}>{QUAL_META[q].label}</option>)}
            </select>
            <button onClick={() => rm(i)} aria-label="remove" className="text-ink-muted hover:text-vermilion text-right">×</button>
          </li>
        ))}
      </ul>
      <button onClick={add} className="font-serif italic text-[13px] text-ink-muted hover:text-vermilion px-3 py-2 border-t border-rule w-full text-left">+ add study</button>
      <div className="p-4 border-t border-rule grid grid-cols-2 gap-4">
        <label>
          <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Strength</span>
          <select value={s.strength} onChange={(e) => upd({ ...s, strength: e.target.value as "strong" | "conditional" })}
            data-testid="grade-strength"
            className="block w-full mt-1 font-serif text-[15px] bg-paper border border-rule px-2 py-1">
            <option value="strong">Strong</option>
            <option value="conditional">Conditional</option>
          </select>
        </label>
        <div className="bg-vermilion/5 border border-vermilion p-3">
          <span className="font-code text-[10px] tracking-[0.22em] uppercase text-vermilion font-medium">Recommend</span>
          <p className="font-serif text-[14px] text-ink mt-1">{s.recommendation}</p>
        </div>
      </div>
    </div>
  );
}
