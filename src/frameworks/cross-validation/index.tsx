"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, InlineNumber } from "@/components/ui";
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
  const best = scored.reduce((a, x) => (x.mean - 0.5 * x.std) > (a.mean - 0.5 * a.std) ? x : a, scored[0]!);

  return (
    <Card>
      <div className="overflow-x-auto"><table className="w-full min-w-[480px]" data-testid="cv-table">
        <thead>
          <tr>
            <th className="text-left px-3 py-2 border-b border-rule"><MicroLabel>Model</MicroLabel></th>
            {(s.models[0]?.foldScores ?? []).map((_, k) => (
              <th key={k} className="text-center py-2"><MicroLabel className="tracking-[0.18em]">f{k + 1}</MicroLabel></th>
            ))}
            <th className="text-right pr-3 border-b border-rule"><MicroLabel>μ ± σ</MicroLabel></th>
          </tr>
        </thead>
        <tbody>
          {scored.map((m) => {
            const isBest = m.i === best.i;
            return (
              <tr key={m.i} className="border-b border-rule" data-testid={`cv-row-${m.i}`}>
                <td className="px-3 py-2">
                  <InlineText
                    value={m.name}
                    onChange={(v) => setName(m.i, v)}
                    italic
                    size="sm"
                    className={isBest ? "text-vermilion font-medium" : ""}
                  />
                </td>
                {m.foldScores.map((sc, k) => (
                  <td key={k} className="text-center py-2">
                    <InlineNumber
                      value={sc}
                      onChange={(v) => setFold(m.i, k, v)}
                      min={0}
                      max={1}
                      step={0.01}
                      size="sm"
                      width="w-12"
                      className="border-b border-rule"
                    />
                  </td>
                ))}
                <td
                  className={`text-right pr-3 font-code text-[13px] font-medium ${isBest ? "text-vermilion" : "text-ink"}`}
                  data-testid={`cv-stats-${m.i}`}
                >
                  {m.mean.toFixed(2)} ± {m.std.toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table></div>
    </Card>
  );
}
