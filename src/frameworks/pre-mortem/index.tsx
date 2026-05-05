"use client";
import { useState } from "react";
import { z } from "zod";

export const meta = {
  id: "pre_mortem",
  name: "Pre-Mortem",
  category: "Cognitive & behavioral",
  blurb: "Imagine the failure has already happened. List why — then plan tripwires.",
} as const;

export const schema = z.object({
  framework: z.literal("pre_mortem"),
  category: z.string(),
  title: z.string(),
  scenario: z.string(),
  risks: z.array(z.object({
    cause: z.string(),
    likelihood: z.number().int().min(1).max(5),
    impact: z.number().int().min(1).max(5),
  })).min(1).max(20),
  recommendation: z.string(),
});
export type PreMortem = z.infer<typeof schema>;

export const sample: PreMortem = {
  framework: "pre_mortem",
  category: meta.category,
  title: "Imagine the launch failed. Why?",
  scenario: "It is 6 months from now. The launch was a disaster.",
  risks: [
    { cause: "we picked the wrong launch date", likelihood: 4, impact: 3 },
    { cause: "key engineer leaves mid-build", likelihood: 3, impact: 5 },
    { cause: "marketing missed the window", likelihood: 2, impact: 4 },
    { cause: "scope crept by 40%", likelihood: 5, impact: 3 },
    { cause: "the data was wrong from day one", likelihood: 1, impact: 5 },
  ],
  recommendation: "Two risks need tripwires now: scope creep (set a kill-feature trigger) and key-engineer dependency (pair them with a backup).",
};

export function View({ data, onUpdate }: { data: PreMortem; onUpdate?: (d: PreMortem) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: PreMortem) => { setS(n); onUpdate?.(n); };
  const set = (i: number, patch: Partial<PreMortem["risks"][number]>) =>
    upd({ ...s, risks: s.risks.map((r, j) => j === i ? { ...r, ...patch } : r) });
  const add = () => upd({ ...s, risks: [...s.risks, { cause: "", likelihood: 3, impact: 3 }] });
  const rm = (i: number) => upd({ ...s, risks: s.risks.filter((_, j) => j !== i) });

  return (
    <div className="border border-ink bg-paper">
      <div className="p-4 bg-paper-deep border-b border-rule">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Scenario</span>
        <input value={s.scenario} onChange={(e) => upd({ ...s, scenario: e.target.value })}
          className="block w-full mt-1 font-serif italic text-[16px] text-ink bg-transparent border-none outline-none" />
      </div>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left px-3 py-2 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted border-b border-rule">Postmortem cause</th>
            <th className="text-center px-3 py-2 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted border-b border-rule">Lik</th>
            <th className="text-center px-3 py-2 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted border-b border-rule">Imp</th>
            <th className="text-center px-3 py-2 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted border-b border-rule w-16">!</th>
            <th className="border-b border-rule" />
          </tr>
        </thead>
        <tbody>
          {s.risks.map((r, i) => {
            const score = r.likelihood * r.impact;
            const danger = score >= 12;
            return (
              <tr key={i} className="border-b border-rule" data-testid={`risk-row-${i}`}>
                <td className="px-3 py-2">
                  <input value={r.cause} onChange={(e) => set(i, { cause: e.target.value })}
                    className={`font-serif italic text-[14px] bg-transparent border-none outline-none w-full ${danger ? "text-vermilion" : "text-ink"}`} />
                </td>
                {(["likelihood", "impact"] as const).map((k) => (
                  <td key={k} className="px-3 py-2 text-center">
                    <input type="range" min={1} max={5} value={r[k]}
                      onChange={(e) => set(i, { [k]: Number(e.target.value) })}
                      data-testid={`risk-${i}-${k}`}
                      aria-label={`${k} for ${r.cause}`}
                      className="w-20" />
                    <div className="font-code text-[11px] text-ink-muted">{r[k]}</div>
                  </td>
                ))}
                <td className="px-3 py-2 text-center">
                  {danger && <span className="text-vermilion font-medium" data-testid={`risk-${i}-danger`}>!</span>}
                </td>
                <td className="px-3 py-2 text-right">
                  <button onClick={() => rm(i)} aria-label="remove" className="text-ink-muted hover:text-vermilion">×</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button onClick={add} className="font-serif italic text-[13px] text-ink-muted hover:text-vermilion px-3 py-2 w-full text-left">+ another cause</button>
    </div>
  );
}
