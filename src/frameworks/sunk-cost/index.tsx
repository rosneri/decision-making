"use client";
import { useState } from "react";
import { z } from "zod";

export const meta = {
  id: "sunk_cost",
  name: "Sunk Cost Avoidance",
  category: "Personal finance",
  blurb: "Past spend is gone. Decide forward — never backward.",
} as const;

export const schema = z.object({
  framework: z.literal("sunk_cost"),
  category: z.string(),
  title: z.string(),
  sunk: z.object({ description: z.string(), value: z.string() }),
  options: z.array(z.object({
    name: z.string(),
    forwardCost: z.string(),
    forwardBenefit: z.string(),
    expectedValue: z.number(),
  })).min(2).max(6),
  recommendation: z.string(),
});
export type SunkCost = z.infer<typeof schema>;

export const sample: SunkCost = {
  framework: "sunk_cost",
  category: meta.category,
  title: "I've spent 2 years on this PhD. Quit?",
  sunk: { description: "PhD years", value: "$140k · 2 yrs" },
  options: [
    { name: "Finish", forwardCost: "+$80k cost · +3 yrs", forwardBenefit: "PhD title · soft job market", expectedValue: 30 },
    { name: "Quit", forwardCost: "0", forwardBenefit: "industry job · $140k/yr starting", expectedValue: 90 },
  ],
  recommendation: "Sunk is sunk. Forward EV strongly favors quitting. Decide forward, not backward.",
};

export function View({ data, onUpdate }: { data: SunkCost; onUpdate?: (d: SunkCost) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: SunkCost) => { setS(n); onUpdate?.(n); };
  const set = (i: number, patch: Partial<SunkCost["options"][number]>) =>
    upd({ ...s, options: s.options.map((o, j) => j === i ? { ...o, ...patch } : o) });

  const best = s.options.reduce((b, o, i) => o.expectedValue > s.options[b]!.expectedValue ? i : b, 0);

  return (
    <div className="border border-ink bg-paper">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_60px_2fr] gap-3 items-stretch">
        <div className="p-4 opacity-50 relative" data-testid="sunk-block">
          <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Sunk · ignore</span>
          <input value={s.sunk.description} onChange={(e) => upd({ ...s, sunk: { ...s.sunk, description: e.target.value } })}
            className="block w-full mt-1 font-serif text-[15px] bg-transparent border-none outline-none text-ink line-through" />
          <input value={s.sunk.value} onChange={(e) => upd({ ...s, sunk: { ...s.sunk, value: e.target.value } })}
            className="block w-full mt-1 font-serif font-medium text-[20px] bg-transparent border-none outline-none text-ink line-through" />
          <p className="mt-2 font-serif italic text-[12px] text-ink-muted">unrecoverable.</p>
        </div>
        <div className="grid place-items-center font-serif text-[24px] text-ink-muted">vs</div>
        <div className="p-4 border-l border-vermilion bg-vermilion/5">
          <span className="font-code text-[10px] tracking-[0.22em] uppercase text-vermilion font-medium">Forward · the only thing that matters</span>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {s.options.map((o, i) => {
              const isBest = i === best;
              return (
                <div key={i} data-testid={`sunk-option-${i}`}
                  className={`p-3 border ${isBest ? "border-vermilion bg-paper" : "border-rule bg-paper"}`}>
                  <input value={o.name} onChange={(e) => set(i, { name: e.target.value })}
                    className={`font-serif text-[15px] font-medium bg-transparent border-none outline-none w-full ${isBest ? "text-vermilion" : "text-ink"}`} />
                  <input value={o.forwardCost} onChange={(e) => set(i, { forwardCost: e.target.value })}
                    className="block w-full mt-1 font-serif italic text-[12px] text-ink-muted bg-transparent border-none outline-none" />
                  <input value={o.forwardBenefit} onChange={(e) => set(i, { forwardBenefit: e.target.value })}
                    className="block w-full font-serif italic text-[12px] text-ink-muted bg-transparent border-none outline-none" />
                  <label className="block mt-2">
                    <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">EV</span>
                    <input type="number" value={o.expectedValue} onChange={(e) => set(i, { expectedValue: Number(e.target.value) || 0 })}
                      data-testid={`sunk-ev-${i}`}
                      className="block w-full font-code text-[15px] font-medium bg-transparent border-b border-rule outline-none text-ink" />
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
