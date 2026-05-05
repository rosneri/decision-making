"use client";
import { useState } from "react";
import { z } from "zod";

export const meta = {
  id: "cross_validation",
  name: "Cross-Validation",
  category: "Data & ML",
  blurb: "Pick the model with high accuracy AND low variance across folds.",
} as const;

export const schema = z.object({
  framework: z.literal("cross_validation"),
  category: z.string(),
  title: z.string(),
  models: z.array(z.object({
    name: z.string(),
    foldScores: z.array(z.number().min(0).max(1)).min(2).max(20),
  })).min(1).max(10),
  recommendation: z.string(),
});
export type CrossValidation = z.infer<typeof schema>;

export const sample: CrossValidation = {
  framework: "cross_validation",
  category: meta.category,
  title: "Pick the model that won't overfit.",
  models: [
    { name: "logistic", foldScores: [0.80, 0.81, 0.83, 0.79, 0.82] },
    { name: "rf · 200 trees", foldScores: [0.85, 0.87, 0.86, 0.84, 0.88] },
    { name: "xgboost", foldScores: [0.82, 0.88, 0.85, 0.83, 0.87] },
    { name: "transformer", foldScores: [0.74, 0.92, 0.78, 0.90, 0.86] },
  ],
  recommendation: "Random forest wins: high mean, lowest variance across folds. Transformer's spread suggests overfitting.",
};

const stats = (xs: number[]) => {
  const m = xs.reduce((a, b) => a + b, 0) / xs.length;
  const v = xs.reduce((a, b) => a + (b - m) ** 2, 0) / xs.length;
  return { mean: m, std: Math.sqrt(v) };
};

export function View({ data, onUpdate }: { data: CrossValidation; onUpdate?: (d: CrossValidation) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: CrossValidation) => { setS(n); onUpdate?.(n); };
  const setName = (i: number, v: string) =>
    upd({ ...s, models: s.models.map((m, j) => j === i ? { ...m, name: v } : m) });
  const setFold = (i: number, k: number, v: number) =>
    upd({ ...s, models: s.models.map((m, j) => j === i ? { ...m, foldScores: m.foldScores.map((x, l) => l === k ? Math.max(0, Math.min(1, v)) : x) } : m) });

  const scored = s.models.map((m, i) => ({ ...m, i, ...stats(m.foldScores) }));
  // best = highest mean - 0.5*std
  const best = scored.reduce((a, x) => (x.mean - 0.5 * x.std) > (a.mean - 0.5 * a.std) ? x : a, scored[0]!);

  return (
    <div className="border border-ink bg-paper">
      <table className="w-full" data-testid="cv-table">
        <thead>
          <tr>
            <th className="text-left px-3 py-2 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted border-b border-rule">Model</th>
            {(s.models[0]?.foldScores ?? []).map((_, k) => (
              <th key={k} className="font-code text-[10px] tracking-[0.18em] uppercase text-ink-muted text-center py-2">f{k + 1}</th>
            ))}
            <th className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted text-right pr-3 border-b border-rule">μ ± σ</th>
          </tr>
        </thead>
        <tbody>
          {scored.map((m) => {
            const isBest = m.i === best.i;
            return (
              <tr key={m.i} className="border-b border-rule" data-testid={`cv-row-${m.i}`}>
                <td className="px-3 py-2">
                  <input value={m.name} onChange={(e) => setName(m.i, e.target.value)}
                    className={`font-serif italic text-[14px] bg-transparent border-none outline-none ${isBest ? "text-vermilion font-medium" : "text-ink"}`} />
                </td>
                {m.foldScores.map((sc, k) => (
                  <td key={k} className="text-center py-2">
                    <input type="number" min={0} max={1} step={0.01} value={sc}
                      onChange={(e) => setFold(m.i, k, Number(e.target.value) || 0)}
                      className="font-code text-[12px] w-12 text-center bg-transparent border-b border-rule outline-none" />
                  </td>
                ))}
                <td className={`text-right pr-3 font-code text-[13px] font-medium ${isBest ? "text-vermilion" : "text-ink"}`}
                  data-testid={`cv-stats-${m.i}`}>
                  {m.mean.toFixed(2)} ± {m.std.toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
