"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, Range } from "@/components/ui";
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

  const scored = s.options.map((o, i) => ({ ...o, i, score: o.consolation - o.desolation }));
  const best = scored.reduce((a, x) => x.score > a.score ? x : a, scored[0]!);
  const initial = best.name.charAt(0).toUpperCase();

  return (
    <Card>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-rule">
        {scored.map((o) => {
          const isBest = o.i === best.i;
          return (
            <div key={o.i} data-testid={`ig-option-${o.i}`} className={`p-4 ${isBest ? "bg-vermilion/5" : ""}`}>
              <InlineText
                value={o.name}
                onChange={(v) => setOpt(o.i, { name: v })}
                className={`text-[16px] font-medium ${isBest ? "text-vermilion" : ""}`}
              />
              <label className="block mt-2">
                <MicroLabel>Consolation</MicroLabel>
                <Range
                  value={o.consolation}
                  onChange={(v) => setOpt(o.i, { consolation: v })}
                  min={0}
                  max={5}
                  testId={`ig-${o.i}-consolation`}
                  ariaLabel={`consolation ${o.name}`}
                  className="block w-full"
                />
              </label>
              <label className="block mt-2">
                <MicroLabel accent>Desolation</MicroLabel>
                <Range
                  value={o.desolation}
                  onChange={(v) => setOpt(o.i, { desolation: v })}
                  min={0}
                  max={5}
                  testId={`ig-${o.i}-desolation`}
                  ariaLabel={`desolation ${o.name}`}
                  className="block w-full"
                />
              </label>
              <InlineText
                value={o.feeling}
                onChange={(v) => setOpt(o.i, { feeling: v })}
                placeholder="when I imagine it…"
                italic
                size="sm"
                className="block w-full mt-2 text-ink-muted border-b border-rule"
              />
            </div>
          );
        })}
      </div>
      <div className="p-4 border-t border-rule">
        <MicroLabel>Sit with it · does it hold?</MicroLabel>
        <div className="mt-3 grid gap-2" style={{ gridTemplateColumns: `repeat(${s.days.length}, 1fr)` }}>
          {s.days.map((d, i) => (
            <label key={i} className="text-center border border-rule p-2">
              <MicroLabel as="span" className="block tracking-[0.18em]">day {i + 1}</MicroLabel>
              <input
                value={d}
                onChange={(e) => setDay(i, e.target.value)}
                data-testid={`ig-day-${i}`}
                maxLength={2}
                className={`block w-full mt-1 font-serif font-medium text-[18px] text-center bg-transparent border-none outline-none ${d.toUpperCase() === initial ? "text-vermilion" : "text-ink"}`}
              />
            </label>
          ))}
        </div>
      </div>
    </Card>
  );
}
