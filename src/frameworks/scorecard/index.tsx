"use client";
import { useState } from "react";
import { z } from "zod";

export const meta = {
  id: "scorecard",
  name: "Scorecard Method",
  category: "Hiring & talent",
  blurb: "Define mission, outcomes, competencies BEFORE meeting candidates. Score each against the card.",
} as const;

export const schema = z.object({
  framework: z.literal("scorecard"),
  category: z.string(),
  title: z.string(),
  mission: z.string(),
  outcomes: z.array(z.string()).min(1).max(8),
  competencies: z.array(z.string()).min(1).max(12),
  recommendation: z.string(),
});
export type Scorecard = z.infer<typeof schema>;

export const sample: Scorecard = {
  framework: "scorecard",
  category: meta.category,
  title: "What would 'great' actually look like in this role?",
  mission: "Grow MRR from $2M to $5M without raising CAC.",
  outcomes: [
    "Ship pricing-page rebuild · +18% conversion",
    "Launch self-serve · 200 paid teams",
    "Cut churn from 4% → 2.5%",
  ],
  competencies: ["analytical", "fast-execute", "writes well", "calm under load", "cross-functional"],
  recommendation: "Score every candidate against THIS card, not against each other. Reject anyone weak on > 2 competencies.",
};

export function View({ data, onUpdate }: { data: Scorecard; onUpdate?: (d: Scorecard) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Scorecard) => { setS(n); onUpdate?.(n); };
  const setOut = (i: number, v: string) => upd({ ...s, outcomes: s.outcomes.map((x, j) => j === i ? v : x) });
  const setComp = (i: number, v: string) => upd({ ...s, competencies: s.competencies.map((x, j) => j === i ? v : x) });
  const addOut = () => upd({ ...s, outcomes: [...s.outcomes, ""] });
  const addComp = () => upd({ ...s, competencies: [...s.competencies, ""] });
  const rmOut = (i: number) => upd({ ...s, outcomes: s.outcomes.filter((_, j) => j !== i) });
  const rmComp = (i: number) => upd({ ...s, competencies: s.competencies.filter((_, j) => j !== i) });

  return (
    <div className="border border-ink bg-paper">
      <div className="p-4 bg-vermilion/5 border-b border-vermilion">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-vermilion font-medium">Mission</span>
        <input value={s.mission} onChange={(e) => upd({ ...s, mission: e.target.value })}
          data-testid="scorecard-mission"
          className="block w-full mt-1 font-serif italic text-[16px] bg-transparent border-none outline-none text-ink" />
      </div>
      <div className="p-4 border-b border-rule">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Outcomes · 12 months</span>
        <ul className="mt-2 space-y-1">
          {s.outcomes.map((o, i) => (
            <li key={i} className="flex items-center gap-2 group border-b border-rule pb-1">
              <span className="font-code text-[11px] text-vermilion w-6">{i + 1}.</span>
              <input value={o} onChange={(e) => setOut(i, e.target.value)}
                className="flex-1 font-serif text-[14px] bg-transparent border-none outline-none text-ink" />
              <button onClick={() => rmOut(i)} aria-label="remove outcome"
                className="opacity-0 group-hover:opacity-100 text-ink-muted hover:text-vermilion">×</button>
            </li>
          ))}
        </ul>
        <button onClick={addOut} className="mt-2 font-serif italic text-[13px] text-ink-muted hover:text-vermilion">+ outcome</button>
      </div>
      <div className="p-4">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Competencies</span>
        <div className="mt-2 flex gap-2 flex-wrap items-center">
          {s.competencies.map((c, i) => (
            <span key={i} className="border border-rule px-2 py-1 flex items-center gap-1 group">
              <input value={c} onChange={(e) => setComp(i, e.target.value)}
                className="font-serif italic text-[13px] bg-transparent border-none outline-none w-28" />
              <button onClick={() => rmComp(i)} aria-label="remove competency"
                className="opacity-0 group-hover:opacity-100 text-ink-muted hover:text-vermilion">×</button>
            </span>
          ))}
          <button onClick={addComp} className="font-serif italic text-[13px] text-ink-muted hover:text-vermilion">+ add</button>
        </div>
      </div>
    </div>
  );
}
