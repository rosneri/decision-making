"use client";
import { useState } from "react";
import { z } from "zod";

export const meta = {
  id: "algo_impact",
  name: "Algorithmic Impact",
  category: "AI alignment",
  blurb: "Score risk dimensions; one open high-severity item blocks shipping.",
} as const;

export const schema = z.object({
  framework: z.literal("algo_impact"),
  category: z.string(),
  title: z.string(),
  risks: z.array(z.object({
    dimension: z.string(),
    severity: z.number().int().min(1).max(5),
    open: z.boolean(),
  })).min(1).max(20),
  recommendation: z.string(),
});
export type AlgoImpact = z.infer<typeof schema>;

export const sample: AlgoImpact = {
  framework: "algo_impact",
  category: meta.category,
  title: "Should we ship the resume-screener model?",
  risks: [
    { dimension: "Disparate impact · gender", severity: 4, open: true },
    { dimension: "Disparate impact · race", severity: 5, open: true },
    { dimension: "Privacy · résumé content", severity: 2, open: false },
    { dimension: "Explainability to candidate", severity: 4, open: true },
    { dimension: "Recourse / appeal path", severity: 3, open: false },
    { dimension: "Model drift over 12mo", severity: 3, open: false },
  ],
  recommendation: "Two open items at severity 4+. Do not ship. Run bias mitigation pass + add explainability before re-evaluation.",
};

export function View({ data, onUpdate }: { data: AlgoImpact; onUpdate?: (d: AlgoImpact) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: AlgoImpact) => { setS(n); onUpdate?.(n); };
  const set = (i: number, patch: Partial<AlgoImpact["risks"][number]>) =>
    upd({ ...s, risks: s.risks.map((r, j) => j === i ? { ...r, ...patch } : r) });
  const add = () => upd({ ...s, risks: [...s.risks, { dimension: "new risk", severity: 3, open: true }] });
  const rm = (i: number) => upd({ ...s, risks: s.risks.filter((_, j) => j !== i) });

  const blockers = s.risks.filter((r) => r.open && r.severity >= 4);
  const blocked = blockers.length > 0;

  return (
    <div className="border border-ink bg-paper">
      <ul className="divide-y divide-rule">
        {s.risks.map((r, i) => {
          const danger = r.open && r.severity >= 4;
          return (
            <li key={i} data-testid={`ai-risk-${i}`}
              className={`p-3 grid grid-cols-[1fr_120px_80px_30px] gap-3 items-center ${danger ? "bg-vermilion/5" : ""}`}>
              <input value={r.dimension} onChange={(e) => set(i, { dimension: e.target.value })}
                className={`font-serif italic text-[14px] bg-transparent border-none outline-none ${danger ? "text-vermilion" : "text-ink"}`} />
              <div className="flex gap-1" role="group" aria-label={`severity ${r.dimension}`}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => set(i, { severity: n })} aria-label={`severity ${n}`}
                    className={`w-3 h-3 ${n <= r.severity ? (danger ? "bg-vermilion" : "bg-ink") : "bg-paper border border-rule"}`} />
                ))}
              </div>
              <button onClick={() => set(i, { open: !r.open })}
                data-testid={`ai-status-${i}`}
                aria-pressed={!r.open}
                className={`font-code text-[11px] tracking-[0.22em] uppercase font-medium ${r.open ? "text-vermilion" : "text-ink"}`}>
                {r.open ? "✗ open" : "✓ ok"}
              </button>
              <button onClick={() => rm(i)} aria-label="remove" className="text-ink-muted hover:text-vermilion">×</button>
            </li>
          );
        })}
      </ul>
      <button onClick={add} className="font-serif italic text-[13px] text-ink-muted hover:text-vermilion px-3 py-2 border-t border-rule w-full text-left">+ risk</button>
      <div className={`p-4 border-t border-ink text-center font-code text-[12px] tracking-[0.22em] uppercase font-medium ${blocked ? "bg-vermilion text-paper" : "bg-paper-deep text-ink"}`}
        data-testid="ai-verdict">
        {blocked ? `Do not ship · ${blockers.length} open severity 4+` : "OK to ship"}
      </div>
    </div>
  );
}
