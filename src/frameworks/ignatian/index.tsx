"use client";
import { useState } from "react";
import { meta, schema, sample, type Ignatian } from "./data";
export { meta, schema, sample };
export type { Ignatian };

export function View({ data, onUpdate }: { data: Ignatian; onUpdate?: (d: Ignatian) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Ignatian) => { setS(n); onUpdate?.(n); };
  const setOpt = (i: number, patch: Partial<Ignatian["options"][number]>) =>
    upd({ ...s, options: s.options.map((o, j) => j === i ? { ...o, ...patch } : o) });
  const setDay = (i: number, v: string) =>
    upd({ ...s, days: s.days.map((d, j) => j === i ? v : d) });

  // option whose consolation - desolation is highest is "right"
  const scored = s.options.map((o, i) => ({ ...o, i, score: o.consolation - o.desolation }));
  const best = scored.reduce((a, x) => x.score > a.score ? x : a, scored[0]!);
  const initial = best.name.charAt(0).toUpperCase();

  return (
    <div className="border border-ink bg-paper">
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-rule">
        {scored.map((o) => {
          const isBest = o.i === best.i;
          return (
            <div key={o.i} data-testid={`ig-option-${o.i}`}
              className={`p-4 ${isBest ? "bg-vermilion/5" : ""}`}>
              <input value={o.name} onChange={(e) => setOpt(o.i, { name: e.target.value })}
                className={`font-serif text-[16px] font-medium bg-transparent border-none outline-none w-full ${isBest ? "text-vermilion" : "text-ink"}`} />
              <label className="block mt-2">
                <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Consolation</span>
                <input type="range" min={0} max={5} value={o.consolation}
                  onChange={(e) => setOpt(o.i, { consolation: Number(e.target.value) })}
                  data-testid={`ig-${o.i}-consolation`}
                  aria-label={`consolation ${o.name}`} className="block w-full" />
              </label>
              <label className="block mt-2">
                <span className="font-code text-[10px] tracking-[0.22em] uppercase text-vermilion">Desolation</span>
                <input type="range" min={0} max={5} value={o.desolation}
                  onChange={(e) => setOpt(o.i, { desolation: Number(e.target.value) })}
                  data-testid={`ig-${o.i}-desolation`}
                  aria-label={`desolation ${o.name}`} className="block w-full" />
              </label>
              <input value={o.feeling} onChange={(e) => setOpt(o.i, { feeling: e.target.value })}
                placeholder="when I imagine it…"
                className="block w-full mt-2 font-serif italic text-[13px] text-ink-muted bg-transparent border-b border-rule outline-none focus:border-vermilion" />
            </div>
          );
        })}
      </div>
      <div className="p-4 border-t border-rule">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Sit with it · does it hold?</span>
        <div className="mt-3 grid gap-2" style={{ gridTemplateColumns: `repeat(${s.days.length}, 1fr)` }}>
          {s.days.map((d, i) => (
            <label key={i} className="text-center border border-rule p-2">
              <span className="block font-code text-[10px] tracking-[0.18em] uppercase text-ink-muted">day {i + 1}</span>
              <input value={d} onChange={(e) => setDay(i, e.target.value)}
                data-testid={`ig-day-${i}`}
                maxLength={2}
                className={`block w-full mt-1 font-serif font-medium text-[18px] text-center bg-transparent border-none outline-none ${d.toUpperCase() === initial ? "text-vermilion" : "text-ink"}`} />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
