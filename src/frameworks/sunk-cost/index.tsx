"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText } from "@/components/ui";
import { meta, schema, sample, type SunkCost } from "./data";
export { meta, schema, sample };
export type { SunkCost };

export function View({ data, onUpdate }: { data: SunkCost; onUpdate?: (d: SunkCost) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: SunkCost) => { setS(n); onUpdate?.(n); };
  const set = (i: number, patch: Partial<SunkCost["options"][number]>) =>
    upd({ ...s, options: s.options.map((o, j) => j === i ? { ...o, ...patch } : o) });

  const best = s.options.reduce((b, o, i) => o.expectedValue > s.options[b]!.expectedValue ? i : b, 0);

  return (
    <Card>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_60px_2fr] gap-3 items-stretch">
        <div className="p-4 opacity-50 relative" data-testid="sunk-block">
          <MicroLabel>Sunk · ignore</MicroLabel>
          <InlineText
            value={s.sunk.description}
            onChange={(v) => upd({ ...s, sunk: { ...s.sunk, description: v } })}
            className="block w-full mt-1 line-through"
          />
          <InlineText
            value={s.sunk.value}
            onChange={(v) => upd({ ...s, sunk: { ...s.sunk, value: v } })}
            className="block w-full mt-1 font-medium text-[20px] line-through"
          />
          <p className="mt-2 font-serif italic text-[12px] text-ink-muted">unrecoverable.</p>
        </div>
        <div className="grid place-items-center font-serif text-[24px] text-ink-muted">vs</div>
        <div className="p-4 border-l border-vermilion bg-vermilion/5">
          <MicroLabel accent bold>Forward · the only thing that matters</MicroLabel>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {s.options.map((o, i) => {
              const isBest = i === best;
              return (
                <div key={i} data-testid={`sunk-option-${i}`} className={`p-3 border ${isBest ? "border-vermilion bg-paper" : "border-rule bg-paper"}`}>
                  <InlineText
                    value={o.name}
                    onChange={(v) => set(i, { name: v })}
                    className={`font-medium ${isBest ? "text-vermilion" : ""}`}
                  />
                  <InlineText
                    value={o.forwardCost}
                    onChange={(v) => set(i, { forwardCost: v })}
                    italic
                    size="sm"
                    className="block w-full mt-1 text-ink-muted"
                  />
                  <InlineText
                    value={o.forwardBenefit}
                    onChange={(v) => set(i, { forwardBenefit: v })}
                    italic
                    size="sm"
                    className="block w-full text-ink-muted"
                  />
                  <label className="block mt-2">
                    <MicroLabel>Expected value</MicroLabel>
                    <input
                      type="number"
                      value={o.expectedValue}
                      onChange={(e) => set(i, { expectedValue: Number(e.target.value) || 0 })}
                      data-testid={`sunk-ev-${i}`}
                      className="block w-full font-code text-[15px] font-medium bg-transparent border-b border-rule outline-none text-ink"
                    />
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
