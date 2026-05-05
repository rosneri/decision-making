"use client";
import { useState } from "react";
import { meta, schema, sample, type CrossValidation, stats } from "./data";
export { meta, schema, sample };
export type { CrossValidation };

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
