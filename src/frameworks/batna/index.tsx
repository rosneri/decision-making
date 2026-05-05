"use client";
import { useState } from "react";
import { z } from "zod";

export const meta = {
  id: "batna",
  name: "BATNA / ZOPA",
  category: "Game theory & negotiation",
  blurb: "Best alternative on each side defines the zone where a deal exists.",
} as const;

export const schema = z.object({
  framework: z.literal("batna"),
  category: z.string(),
  title: z.string(),
  unit: z.string(),
  yourBatna: z.object({ label: z.string(), value: z.number() }),
  theirBatna: z.object({ label: z.string(), value: z.number() }),
  yourTarget: z.number(),
  yourAnchor: z.number(),
  recommendation: z.string(),
});
export type Batna = z.infer<typeof schema>;

export const sample: Batna = {
  framework: "batna",
  category: meta.category,
  title: "Salary negotiation — what's my walkaway?",
  unit: "$k",
  yourBatna: { label: "stay at current job", value: 145 },
  theirBatna: { label: "hire 2nd choice", value: 180 },
  yourTarget: 170,
  yourAnchor: 185,
  recommendation: "Anchor at 185, target 170. Below 145, walk; above 180, they walk.",
};

export function View({ data, onUpdate }: { data: Batna; onUpdate?: (d: Batna) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Batna) => { setS(n); onUpdate?.(n); };

  const lo = s.yourBatna.value;
  const hi = s.theirBatna.value;
  const zopaExists = lo < hi;
  const min = Math.min(lo, hi, s.yourTarget, s.yourAnchor) - 20;
  const max = Math.max(lo, hi, s.yourTarget, s.yourAnchor) + 20;
  const span = max - min || 1;
  const pct = (v: number) => ((v - min) / span) * 100;

  return (
    <div className="border border-ink bg-paper">
      <div className="grid grid-cols-2 divide-x divide-rule border-b border-rule">
        {[
          { side: "yours" as const, k: "yourBatna" as const, label: "Your BATNA", val: s.yourBatna },
          { side: "theirs" as const, k: "theirBatna" as const, label: "Their BATNA", val: s.theirBatna },
        ].map((c) => (
          <div key={c.k} className="p-4">
            <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">{c.label}</span>
            <input value={c.val.label} onChange={(e) => upd({ ...s, [c.k]: { ...c.val, label: e.target.value } })}
              className="block w-full mt-1 font-serif text-[15px] bg-transparent border-none outline-none text-ink" />
            <div className="flex items-baseline gap-1 mt-2">
              <span className="font-code text-[11px] text-ink-muted">{s.unit}</span>
              <input type="number" value={c.val.value}
                onChange={(e) => upd({ ...s, [c.k]: { ...c.val, value: Number(e.target.value) || 0 } })}
                data-testid={`batna-${c.k}-value`}
                className="font-serif font-medium text-[24px] text-vermilion w-24 bg-transparent border-b border-rule outline-none focus:border-vermilion" />
            </div>
          </div>
        ))}
      </div>
      <div className="p-6">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Salary band</span>
        <div className="relative h-16 mt-3 border-2 border-ink" data-testid="batna-band">
          {zopaExists && (
            <div className="absolute inset-y-0 bg-vermilion/20 border-l border-r border-vermilion grid place-items-center"
              style={{ left: `${pct(lo)}%`, width: `${pct(hi) - pct(lo)}%` }} data-testid="batna-zopa">
              <span className="font-code text-[10px] tracking-[0.22em] uppercase text-vermilion font-medium">ZOPA</span>
            </div>
          )}
          {!zopaExists && (
            <div className="absolute inset-0 grid place-items-center font-code text-[11px] tracking-[0.18em] uppercase text-vermilion" data-testid="batna-no-zopa">
              No ZOPA — no deal exists
            </div>
          )}
          <span className="absolute -bottom-5 font-code text-[11px] text-ink-muted" style={{ left: `${pct(lo)}%`, transform: "translateX(-50%)" }}>{lo}</span>
          <span className="absolute -bottom-5 font-code text-[11px] text-ink-muted" style={{ left: `${pct(hi)}%`, transform: "translateX(-50%)" }}>{hi}</span>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-10">
          <label>
            <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Anchor first at</span>
            <input type="number" value={s.yourAnchor} onChange={(e) => upd({ ...s, yourAnchor: Number(e.target.value) || 0 })}
              data-testid="batna-anchor"
              className="block w-full mt-1 font-serif text-[18px] bg-transparent border-b border-rule outline-none focus:border-vermilion py-1" />
          </label>
          <label>
            <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Target</span>
            <input type="number" value={s.yourTarget} onChange={(e) => upd({ ...s, yourTarget: Number(e.target.value) || 0 })}
              data-testid="batna-target"
              className="block w-full mt-1 font-serif text-[18px] bg-transparent border-b border-rule outline-none focus:border-vermilion py-1" />
          </label>
        </div>
      </div>
    </div>
  );
}
