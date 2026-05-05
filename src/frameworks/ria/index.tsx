"use client";
import { useState } from "react";
import { z } from "zod";

export const meta = {
  id: "ria",
  name: "Regulatory Impact Assessment",
  category: "Public policy",
  blurb: "Sum stakeholder impacts (weighted by power); flag who needs mitigation.",
} as const;

export const schema = z.object({
  framework: z.literal("ria"),
  category: z.string(),
  title: z.string(),
  stakeholders: z.array(z.object({
    name: z.string(),
    netImpact: z.number(),
    power: z.number().int().min(1).max(5),
  })).min(1).max(20),
  recommendation: z.string(),
});
export type Ria = z.infer<typeof schema>;

export const sample: Ria = {
  framework: "ria",
  category: meta.category,
  title: "Will the carbon-pricing rule do net good?",
  stakeholders: [
    { name: "households", netImpact: 120, power: 4 },
    { name: "small biz", netImpact: -45, power: 3 },
    { name: "utilities", netImpact: -210, power: 5 },
    { name: "labor", netImpact: 60, power: 4 },
    { name: "regulators", netImpact: 0, power: 5 },
    { name: "future gen", netImpact: 400, power: 1 },
  ],
  recommendation: "Net benefit is positive (+$325/yr). Mitigate small biz and utilities or the rule won't pass.",
};

export function View({ data, onUpdate }: { data: Ria; onUpdate?: (d: Ria) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Ria) => { setS(n); onUpdate?.(n); };
  const set = (i: number, patch: Partial<Ria["stakeholders"][number]>) =>
    upd({ ...s, stakeholders: s.stakeholders.map((x, j) => j === i ? { ...x, ...patch } : x) });
  const add = () => upd({ ...s, stakeholders: [...s.stakeholders, { name: "stakeholder", netImpact: 0, power: 3 }] });
  const rm = (i: number) => upd({ ...s, stakeholders: s.stakeholders.filter((_, j) => j !== i) });

  const sum = s.stakeholders.reduce((a, x) => a + x.netImpact, 0);
  const need = s.stakeholders.filter((x) => x.netImpact < 0 && x.power >= 3);
  const max = Math.max(...s.stakeholders.map((x) => Math.abs(x.netImpact)), 1);

  return (
    <div className="border border-ink bg-paper">
      <ul className="divide-y divide-rule">
        {s.stakeholders.map((x, i) => {
          const concern = x.netImpact < 0 && x.power >= 3;
          return (
            <li key={i} data-testid={`ria-row-${i}`}
              className={`p-3 grid grid-cols-[1fr_70px_2fr_70px_30px] gap-3 items-center ${concern ? "bg-vermilion/5" : ""}`}>
              <input value={x.name} onChange={(e) => set(i, { name: e.target.value })}
                className={`font-serif italic text-[14px] bg-transparent border-none outline-none ${concern ? "text-vermilion" : "text-ink"}`} />
              <div className="flex gap-1" role="group" aria-label={`power ${x.name}`}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => set(i, { power: n })} aria-label={`power ${n}`}
                    className={`w-2 h-4 ${n <= x.power ? (concern ? "bg-vermilion" : "bg-ink") : "bg-paper border border-rule"}`} />
                ))}
              </div>
              <div className="relative h-6 border border-rule">
                <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-rule" />
                <div className={`absolute inset-y-0 ${x.netImpact < 0 ? "bg-vermilion" : "bg-ink"}`}
                  style={{
                    left: x.netImpact < 0 ? `${50 - (Math.abs(x.netImpact) / max) * 50}%` : "50%",
                    width: `${(Math.abs(x.netImpact) / max) * 50}%`,
                  }} />
              </div>
              <input type="number" value={x.netImpact} onChange={(e) => set(i, { netImpact: Number(e.target.value) || 0 })}
                data-testid={`ria-impact-${i}`}
                className={`font-code text-[13px] w-16 text-right bg-transparent border-b border-rule outline-none ${x.netImpact < 0 ? "text-vermilion" : "text-ink"}`} />
              <button onClick={() => rm(i)} aria-label="remove" className="text-ink-muted hover:text-vermilion">×</button>
            </li>
          );
        })}
      </ul>
      <button onClick={add} className="font-serif italic text-[13px] text-ink-muted hover:text-vermilion px-3 py-2 border-t border-rule w-full text-left">+ stakeholder</button>
      <div className="grid grid-cols-2 border-t border-rule">
        <div className="p-4">
          <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Net benefit</span>
          <div className={`font-serif font-medium text-[24px] mt-1 ${sum >= 0 ? "text-ink" : "text-vermilion"}`} data-testid="ria-net">
            {sum >= 0 ? "+" : ""}{sum}
          </div>
        </div>
        <div className="p-4 bg-vermilion/5 border-l border-vermilion">
          <span className="font-code text-[10px] tracking-[0.22em] uppercase text-vermilion font-medium">Needs mitigation</span>
          <div className="font-serif text-[14px] text-vermilion mt-1" data-testid="ria-mitigate">
            {need.length === 0 ? "—" : need.map((x) => x.name).join(" · ")}
          </div>
        </div>
      </div>
    </div>
  );
}
