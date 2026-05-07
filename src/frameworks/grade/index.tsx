"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, AddButton, RemoveButton } from "@/components/ui";
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
    <Card>
      <div className="overflow-x-auto"><ul className="divide-y divide-rule min-w-[420px]">
        {s.studies.map((x, i) => (
          <li
            key={i}
            data-testid={`grade-study-${i}`}
            className="p-3 grid grid-cols-[1fr_70px_180px_30px] gap-2 items-center"
          >
            <InlineText value={x.type} onChange={(v) => set(i, { type: v })} size="sm" />
            <input
              type="number"
              min={0}
              value={x.n ?? ""}
              placeholder="n"
              onChange={(e) => set(i, { n: e.target.value === "" ? undefined : Math.max(0, Number(e.target.value) || 0) })}
              className="font-code text-[12px] w-16 text-center bg-transparent border-b border-rule outline-none text-ink-muted"
            />
            <select
              value={x.quality}
              onChange={(e) => set(i, { quality: e.target.value as Qual })}
              aria-label={`quality for ${x.type}`}
              className="font-code text-[10px] tracking-[0.18em] uppercase bg-transparent border border-rule px-2 py-1"
            >
              {QUAL.map((q) => <option key={q} value={q}>{QUAL_META[q].label}</option>)}
            </select>
            <RemoveButton onClick={() => rm(i)} ariaLabel="remove" className="text-right" />
          </li>
        ))}
      </ul></div>
      <AddButton onClick={add} className="px-3 py-2 border-t border-rule w-full text-left">+ add study</AddButton>
      <div className="p-4 border-t border-rule grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label>
          <MicroLabel>Strength</MicroLabel>
          <select
            value={s.strength}
            onChange={(e) => upd({ ...s, strength: e.target.value as "strong" | "conditional" })}
            data-testid="grade-strength"
            className="block w-full mt-1 font-serif text-[15px] bg-paper border border-rule px-2 py-1"
          >
            <option value="strong">Strong</option>
            <option value="conditional">Conditional</option>
          </select>
        </label>
        <div className="bg-vermilion/5 border border-vermilion p-3">
          <MicroLabel accent bold>Recommend</MicroLabel>
          <p className="font-serif text-[14px] text-ink mt-1">{s.recommendation}</p>
        </div>
      </div>
    </Card>
  );
}
