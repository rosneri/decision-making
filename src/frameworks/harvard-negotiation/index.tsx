"use client";
import { useState } from "react";
import { meta, schema, sample, type Harvard, type Section, META } from "./data";
export { meta, schema, sample };
export type { Harvard };

export function View({ data, onUpdate }: { data: Harvard; onUpdate?: (d: Harvard) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Harvard) => { setS(n); onUpdate?.(n); };
  const setItem = (sec: Section, i: number, v: string) =>
    upd({ ...s, [sec]: s[sec].map((x, j) => j === i ? v : x) });
  const add = (sec: Section) => upd({ ...s, [sec]: [...s[sec], ""] });
  const rm = (sec: Section, i: number) => upd({ ...s, [sec]: s[sec].filter((_, j) => j !== i) });

  return (
    <div className="border border-ink bg-paper grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-rule">
      {(Object.keys(META) as Section[]).map((sec) => (
        <div key={sec} className={`p-4 ${META[sec].accent ? "bg-vermilion/5" : ""}`} data-testid={`hn-${sec}`}>
          <span className={`font-code text-[10px] tracking-[0.22em] uppercase font-medium ${META[sec].accent ? "text-vermilion" : "text-ink-muted"}`}>
            {META[sec].label} · <span className="italic font-normal">{META[sec].sub}</span>
          </span>
          <ul className="mt-3 space-y-1">
            {s[sec].map((x, i) => (
              <li key={i} className="flex items-center gap-2 group border-b border-rule pb-1">
                <input value={x} onChange={(e) => setItem(sec, i, e.target.value)}
                  className="flex-1 font-serif text-[14px] bg-transparent border-none outline-none text-ink" />
                <button onClick={() => rm(sec, i)} aria-label="remove"
                  className="opacity-0 group-hover:opacity-100 text-ink-muted hover:text-vermilion">×</button>
              </li>
            ))}
          </ul>
          <button onClick={() => add(sec)} className="mt-2 font-serif italic text-[13px] text-ink-muted hover:text-vermilion">+ add</button>
        </div>
      ))}
    </div>
  );
}
