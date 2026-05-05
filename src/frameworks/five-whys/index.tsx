"use client";
import { useState } from "react";
import { meta, schema, sample, type FiveWhys } from "./data";
export { meta, schema, sample };
export type { FiveWhys };

export function View({ data, onUpdate }: { data: FiveWhys; onUpdate?: (d: FiveWhys) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: FiveWhys) => { setS(n); onUpdate?.(n); };
  const set = (i: number, v: string) =>
    upd({ ...s, whys: s.whys.map((w, j) => j === i ? v : w) });
  const add = () => upd({ ...s, whys: [...s.whys, ""] });
  const rm = (i: number) => upd({ ...s, whys: s.whys.filter((_, j) => j !== i) });

  return (
    <div className="border border-ink bg-paper p-4 space-y-2">
      <div className="flex items-center gap-3 p-3 border border-ink bg-ink text-paper" data-testid="five-whys-problem">
        <span className="w-8 h-8 grid place-items-center border border-paper font-code text-[14px] font-medium">!</span>
        <input value={s.problem} onChange={(e) => upd({ ...s, problem: e.target.value })}
          className="flex-1 font-serif text-[16px] bg-transparent border-none outline-none text-paper placeholder:text-paper/50" />
        <span className="font-code text-[10px] tracking-[0.22em] uppercase">Symptom</span>
      </div>
      {s.whys.map((w, i) => {
        const isRoot = i === s.whys.length - 1;
        return (
          <div key={i} data-testid={`why-${i}`}
            className={`flex items-center gap-3 p-3 border ${isRoot ? "border-vermilion bg-vermilion/5" : "border-rule"}`}>
            <span className={`w-8 h-8 grid place-items-center font-code text-[12px] font-medium ${isRoot ? "bg-vermilion text-paper" : "bg-paper border border-ink text-ink"}`}>
              {isRoot ? "★" : i + 1}
            </span>
            <span className="font-code text-[11px] text-ink-muted">why?</span>
            <input value={w} onChange={(e) => set(i, e.target.value)}
              className={`flex-1 font-serif text-[15px] bg-transparent border-none outline-none ${isRoot ? "text-vermilion" : "text-ink"}`} />
            {isRoot && <span className="font-code text-[10px] tracking-[0.22em] uppercase text-vermilion font-medium">Root</span>}
            <button onClick={() => rm(i)} aria-label="remove" className="text-ink-muted hover:text-vermilion">×</button>
          </div>
        );
      })}
      <button onClick={add} className="font-serif italic text-[13px] text-ink-muted hover:text-vermilion">+ another why</button>
    </div>
  );
}
