"use client";
import { useState } from "react";
import { z } from "zod";

export const meta = {
  id: "qaly",
  name: "Cost-Effectiveness · QALY",
  category: "Public policy",
  blurb: "Rank interventions by $ per quality-adjusted life year. Fund what's below the WTP threshold.",
} as const;

export const schema = z.object({
  framework: z.literal("qaly"),
  category: z.string(),
  title: z.string(),
  wtpPerQaly: z.number().min(0),
  interventions: z.array(z.object({
    name: z.string(),
    cost: z.number().min(0),
    qalyGained: z.number().min(0),
  })).min(1).max(20),
  recommendation: z.string(),
});
export type Qaly = z.infer<typeof schema>;

export const sample: Qaly = {
  framework: "qaly",
  category: meta.category,
  title: "Where should the next $10M of health budget go?",
  wtpPerQaly: 50000,
  interventions: [
    { name: "vaccinate kids · measles", cost: 12, qalyGained: 4.2 },
    { name: "smoking cessation program", cost: 1100, qalyGained: 2.1 },
    { name: "diabetes screening", cost: 4500, qalyGained: 1.8 },
    { name: "MRI for back pain", cost: 18000, qalyGained: 0.3 },
  ],
  recommendation: "Fund: vaccination, cessation, screening (all <$50k/QALY). Skip MRI for non-specific back pain.",
};

export function View({ data, onUpdate }: { data: Qaly; onUpdate?: (d: Qaly) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Qaly) => { setS(n); onUpdate?.(n); };
  const set = (i: number, patch: Partial<Qaly["interventions"][number]>) =>
    upd({ ...s, interventions: s.interventions.map((x, j) => j === i ? { ...x, ...patch } : x) });
  const add = () => upd({ ...s, interventions: [...s.interventions, { name: "intervention", cost: 1000, qalyGained: 1 }] });
  const rm = (i: number) => upd({ ...s, interventions: s.interventions.filter((_, j) => j !== i) });

  const scored = s.interventions.map((x, i) => ({
    ...x, i,
    perQaly: x.qalyGained > 0 ? x.cost / x.qalyGained : Infinity,
  }));
  const fund = scored.filter((x) => x.perQaly < s.wtpPerQaly);

  return (
    <div className="border border-ink bg-paper">
      <div className="p-4 border-b border-rule">
        <label>
          <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">WTP threshold ($/QALY)</span>
          <input type="number" min={0} value={s.wtpPerQaly}
            onChange={(e) => upd({ ...s, wtpPerQaly: Math.max(0, Number(e.target.value) || 0) })}
            data-testid="qaly-wtp"
            className="block mt-1 font-serif font-medium text-[24px] bg-transparent border-b border-rule outline-none text-ink w-48" />
        </label>
      </div>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left px-3 py-2 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted border-b border-rule">Intervention</th>
            <th className="text-center px-3 py-2 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted border-b border-rule">Cost</th>
            <th className="text-center px-3 py-2 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted border-b border-rule">QALY</th>
            <th className="text-right px-3 py-2 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted border-b border-rule">$/QALY</th>
            <th className="border-b border-rule" />
          </tr>
        </thead>
        <tbody>
          {scored.map((x) => {
            const isFund = x.perQaly < s.wtpPerQaly;
            return (
              <tr key={x.i} className="border-b border-rule" data-testid={`qaly-row-${x.i}`}>
                <td className="px-3 py-2">
                  <input value={x.name} onChange={(e) => set(x.i, { name: e.target.value })}
                    className={`font-serif italic text-[14px] bg-transparent border-none outline-none ${isFund ? "text-vermilion" : "text-ink"}`} />
                  {isFund && <span className="ml-2 font-code text-[10px] tracking-[0.18em] uppercase text-vermilion">★ fund</span>}
                </td>
                <td className="px-3 py-2 text-center">
                  <input type="number" min={0} value={x.cost}
                    onChange={(e) => set(x.i, { cost: Math.max(0, Number(e.target.value) || 0) })}
                    className="font-code text-[13px] w-20 text-center bg-transparent border-b border-rule outline-none" />
                </td>
                <td className="px-3 py-2 text-center">
                  <input type="number" min={0} step={0.1} value={x.qalyGained}
                    onChange={(e) => set(x.i, { qalyGained: Math.max(0, Number(e.target.value) || 0) })}
                    className="font-code text-[13px] w-16 text-center bg-transparent border-b border-rule outline-none" />
                </td>
                <td className={`px-3 py-2 text-right font-code text-[13px] font-medium ${isFund ? "text-vermilion" : "text-ink"}`}
                  data-testid={`qaly-perqaly-${x.i}`}>
                  ${isFinite(x.perQaly) ? Math.round(x.perQaly).toLocaleString() : "∞"}
                </td>
                <td className="px-3 py-2 text-right">
                  <button onClick={() => rm(x.i)} aria-label="remove" className="text-ink-muted hover:text-vermilion">×</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button onClick={add} className="font-serif italic text-[13px] text-ink-muted hover:text-vermilion px-3 py-2 w-full text-left border-t border-rule">+ intervention</button>
      <div className="p-4 border-t border-rule bg-paper-deep">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Funded</span>
        <span className="ml-2 font-serif text-[14px] text-vermilion font-medium" data-testid="qaly-funded-count">{fund.length} of {s.interventions.length}</span>
      </div>
    </div>
  );
}
