"use client";
import { useState } from "react";
import { z } from "zod";

export const meta = {
  id: "budget_503020",
  name: "50/30/20 Budgeting",
  category: "Personal finance",
  blurb: "Needs · wants · save/debt — a starting heuristic, not a law.",
} as const;

export const schema = z.object({
  framework: z.literal("budget_503020"),
  category: z.string(),
  title: z.string(),
  income: z.number().min(0),
  actuals: z.object({
    needs: z.number().min(0),
    wants: z.number().min(0),
    save: z.number().min(0),
  }),
  recommendation: z.string(),
});
export type Budget = z.infer<typeof schema>;

export const sample: Budget = {
  framework: "budget_503020",
  category: meta.category,
  title: "Take-home is $4,800/mo. How do I split it?",
  income: 4800,
  actuals: { needs: 2688, wants: 1536, save: 576 },
  recommendation: "Wants are 32% (target 30%); save/debt is 12% (target 20%). Move ~$400/mo from wants to savings.",
};

export function View({ data, onUpdate }: { data: Budget; onUpdate?: (d: Budget) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Budget) => { setS(n); onUpdate?.(n); };
  const total = s.actuals.needs + s.actuals.wants + s.actuals.save || 1;
  const pct = (v: number) => (v / total) * 100;

  const target = { needs: 0.5, wants: 0.3, save: 0.2 };
  const targetAmt = (k: keyof Budget["actuals"]) => s.income * target[k];
  const delta = (k: keyof Budget["actuals"]) => s.actuals[k] - targetAmt(k);

  return (
    <div className="border border-ink bg-paper">
      <div className="p-4 border-b border-rule">
        <label>
          <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Take-home / month</span>
          <input type="number" min={0} value={s.income}
            onChange={(e) => upd({ ...s, income: Math.max(0, Number(e.target.value) || 0) })}
            data-testid="budget-income"
            className="block mt-1 font-serif font-medium text-[24px] bg-transparent border-b border-rule outline-none text-ink w-32" />
        </label>
      </div>
      <div className="p-4">
        <div className="flex h-12 border-2 border-ink" data-testid="budget-bar">
          <div className="bg-ink grid place-items-center text-paper font-code text-[11px]" style={{ width: `${pct(s.actuals.needs)}%` }}>
            {pct(s.actuals.needs).toFixed(0)}%
          </div>
          <div className="bg-ink-muted grid place-items-center text-paper font-code text-[11px]" style={{ width: `${pct(s.actuals.wants)}%` }}>
            {pct(s.actuals.wants).toFixed(0)}%
          </div>
          <div className="bg-vermilion grid place-items-center text-paper font-code text-[11px]" style={{ width: `${pct(s.actuals.save)}%` }}>
            {pct(s.actuals.save).toFixed(0)}%
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {(["needs", "wants", "save"] as const).map((k, i) => (
            <label key={k} className={`p-3 border ${i === 2 ? "border-vermilion bg-vermilion/5" : "border-rule"}`}>
              <span className={`font-code text-[10px] tracking-[0.22em] uppercase font-medium ${i === 2 ? "text-vermilion" : "text-ink-muted"}`}>
                {k} · {Math.round(target[k] * 100)}%
              </span>
              <input type="number" min={0} value={s.actuals[k]}
                onChange={(e) => upd({ ...s, actuals: { ...s.actuals, [k]: Math.max(0, Number(e.target.value) || 0) } })}
                data-testid={`budget-${k}`}
                className="block mt-1 font-serif font-medium text-[20px] w-full bg-transparent border-b border-rule outline-none text-ink" />
              <span className={`font-code text-[11px] ${delta(k) > 1 ? "text-vermilion" : delta(k) < -1 ? "text-ink-muted" : "text-ink"}`}>
                target ${targetAmt(k).toFixed(0)} · Δ {delta(k) > 0 ? "+" : ""}{delta(k).toFixed(0)}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
