"use client";
import { useState } from "react";
import { z } from "zod";

export const meta = {
  id: "structured_interview",
  name: "Structured Interviewing",
  category: "Hiring & talent",
  blurb: "Same questions, same rubric, every candidate. Cuts gut bias roughly in half.",
} as const;

export const schema = z.object({
  framework: z.literal("structured_interview"),
  category: z.string(),
  title: z.string(),
  dimensions: z.array(z.string()).min(1).max(8),
  candidates: z.array(z.object({
    name: z.string(),
    scores: z.array(z.number().int().min(1).max(5)),
  })).min(1).max(10),
  recommendation: z.string(),
});
export type StructuredInterview = z.infer<typeof schema>;

export const sample: StructuredInterview = {
  framework: "structured_interview",
  category: meta.category,
  title: "Three finalists for the staff engineer role.",
  dimensions: ["coding", "systems", "collab", "ownership"],
  candidates: [
    { name: "Aria", scores: [4, 3, 5, 4] },
    { name: "Beni", scores: [5, 4, 2, 3] },
    { name: "Caro", scores: [3, 3, 4, 3] },
  ],
  recommendation: "Aria leads on average and is strongest on the most predictive dimensions (collab, ownership). Hire.",
};

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

  return (
    <div className="border border-ink bg-paper overflow-x-auto">
      <table className="w-full" data-testid="si-table">
        <thead>
          <tr>
            <th className="text-left px-3 py-2 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted border-b border-rule">Candidate</th>
            {s.dimensions.map((d, k) => (
              <th key={k} className="text-center px-2 py-2 border-b border-rule">
                <input value={d} onChange={(e) => setDim(k, e.target.value)}
                  className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted bg-transparent border-none outline-none text-center w-20" />
              </th>
            ))}
            <th className="text-right px-3 py-2 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted border-b border-rule">Avg</th>
          </tr>
        </thead>
        <tbody>
          {ranked.map((c) => {
            const isWinner = c.i === winner.i;
            return (
              <tr key={c.i} className="border-b border-rule" data-testid={`si-row-${c.i}`}>
                <td className="px-3 py-2">
                  <input value={c.name} onChange={(e) => setName(c.i, e.target.value)}
                    className={`font-serif text-[15px] bg-transparent border-none outline-none ${isWinner ? "text-vermilion font-medium" : "text-ink"}`} />
                </td>
                {c.scores.map((sc, k) => (
                  <td key={k} className="text-center px-2 py-2">
                    <input type="number" min={1} max={5} value={sc}
                      onChange={(e) => setScore(c.i, k, Math.max(1, Math.min(5, Number(e.target.value) || 1)))}
                      data-testid={`si-score-${c.i}-${k}`}
                      className="font-code text-[13px] w-10 text-center bg-transparent border-b border-rule outline-none text-ink" />
                  </td>
                ))}
                <td className={`text-right px-3 py-2 font-code text-[14px] font-medium ${isWinner ? "text-vermilion" : "text-ink"}`}
                  data-testid={`si-avg-${c.i}`}>
                  {c.avg.toFixed(1)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
