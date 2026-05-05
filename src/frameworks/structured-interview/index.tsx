"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, InlineNumber } from "@/components/ui";
import { meta, schema, sample, type StructuredInterview } from "./data";
export { meta, schema, sample };
export type { StructuredInterview };

export function View({ data, onUpdate }: { data: StructuredInterview; onUpdate?: (d: StructuredInterview) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: StructuredInterview) => { setS(n); onUpdate?.(n); };

  const setName = (i: number, v: string) =>
    upd({ ...s, candidates: s.candidates.map((c, j) => j === i ? { ...c, name: v } : c) });
  const setScore = (i: number, k: number, v: number) =>
    upd({ ...s, candidates: s.candidates.map((c, j) => j === i ? { ...c, scores: c.scores.map((x, l) => l === k ? v : x) } : c) });
  const setDim = (k: number, v: string) =>
    upd({ ...s, dimensions: s.dimensions.map((d, j) => j === k ? v : d) });

  const avg = (c: StructuredInterview["candidates"][number]) =>
    c.scores.reduce((a, b) => a + b, 0) / Math.max(1, c.scores.length);

  const ranked = s.candidates.map((c, i) => ({ ...c, i, avg: avg(c) }));
  const winner = ranked.reduce((a, x) => x.avg > a.avg ? x : a, ranked[0]!);

  const head = "px-3 py-2 border-b border-rule";

  return (
    <Card className="overflow-x-auto">
      <table className="w-full" data-testid="si-table">
        <thead>
          <tr>
            <th className={`${head} text-left`}><MicroLabel>Candidate</MicroLabel></th>
            {s.dimensions.map((d, k) => (
              <th key={k} className="text-center px-2 py-2 border-b border-rule">
                <input
                  value={d}
                  onChange={(e) => setDim(k, e.target.value)}
                  className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted bg-transparent border-none outline-none text-center w-20"
                />
              </th>
            ))}
            <th className={`${head} text-right`}><MicroLabel>Avg</MicroLabel></th>
          </tr>
        </thead>
        <tbody>
          {ranked.map((c) => {
            const isWinner = c.i === winner.i;
            return (
              <tr key={c.i} className="border-b border-rule" data-testid={`si-row-${c.i}`}>
                <td className="px-3 py-2">
                  <InlineText
                    value={c.name}
                    onChange={(v) => setName(c.i, v)}
                    className={isWinner ? "text-vermilion font-medium" : ""}
                  />
                </td>
                {c.scores.map((sc, k) => (
                  <td key={k} className="text-center px-2 py-2">
                    <InlineNumber
                      value={sc}
                      onChange={(v) => setScore(c.i, k, Math.max(1, Math.min(5, v)))}
                      min={1}
                      max={5}
                      size="sm"
                      width="w-10"
                      testId={`si-score-${c.i}-${k}`}
                      className="border-b border-rule"
                    />
                  </td>
                ))}
                <td
                  className={`text-right px-3 py-2 font-code text-[14px] font-medium ${isWinner ? "text-vermilion" : "text-ink"}`}
                  data-testid={`si-avg-${c.i}`}
                >
                  {c.avg.toFixed(1)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}
