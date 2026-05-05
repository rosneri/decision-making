"use client";
import { useState } from "react";
import { z } from "zod";

export const meta = {
  id: "ach",
  name: "Analysis of Competing Hypotheses",
  category: "Military & intelligence",
  blurb: "Score every piece of evidence against every hypothesis; favor the one with fewest contradictions.",
} as const;

export const schema = z.object({
  framework: z.literal("ach"),
  category: z.string(),
  title: z.string(),
  hypotheses: z.array(z.string()).min(2).max(8),
  evidence: z.array(z.object({
    text: z.string(),
    consistency: z.array(z.enum(["+", "-", "?"])),
  })).min(1).max(20),
  recommendation: z.string(),
});
export type Ach = z.infer<typeof schema>;

export const sample: Ach = {
  framework: "ach",
  category: meta.category,
  title: "Who breached the network last weekend?",
  hypotheses: ["state actor", "insider leak", "careless vendor", "random opportunist"],
  evidence: [
    { text: "log timestamps off-hours", consistency: ["+", "+", "-", "+"] },
    { text: "exfil to known C2", consistency: ["+", "-", "-", "-"] },
    { text: "no ransom demand", consistency: ["+", "+", "-", "-"] },
    { text: "credentials valid", consistency: ["+", "+", "+", "-"] },
    { text: "trace from Azerbaijan", consistency: ["+", "-", "-", "+"] },
  ],
  recommendation: "State actor has fewest inconsistencies. Treat as working hypothesis, not conclusion — keep collecting signals.",
};

const cycle = (v: "+" | "-" | "?"): "+" | "-" | "?" => v === "+" ? "-" : v === "-" ? "?" : "+";

export function View({ data, onUpdate }: { data: Ach; onUpdate?: (d: Ach) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Ach) => { setS(n); onUpdate?.(n); };
  const setHyp = (i: number, v: string) =>
    upd({ ...s, hypotheses: s.hypotheses.map((h, j) => j === i ? v : h) });
  const setEv = (i: number, patch: Partial<Ach["evidence"][number]>) =>
    upd({ ...s, evidence: s.evidence.map((e, j) => j === i ? { ...e, ...patch } : e) });
  const cycleCell = (i: number, j: number) => {
    const ev = s.evidence[i]!;
    const next = [...ev.consistency];
    next[j] = cycle(next[j] ?? "?");
    setEv(i, { consistency: next });
  };
  const addEv = () =>
    upd({ ...s, evidence: [...s.evidence, { text: "new evidence", consistency: s.hypotheses.map(() => "?") }] });
  const rmEv = (i: number) => upd({ ...s, evidence: s.evidence.filter((_, j) => j !== i) });

  // inconsistencies = count of "-" per hypothesis
  const inconsist = s.hypotheses.map((_, j) =>
    s.evidence.reduce((a, e) => a + (e.consistency[j] === "-" ? 1 : 0), 0)
  );
  const minIdx = inconsist.indexOf(Math.min(...inconsist));

  return (
    <div className="border border-ink bg-paper overflow-x-auto">
      <table className="w-full" data-testid="ach-table">
        <thead>
          <tr>
            <th className="text-left px-3 py-2 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted border-b border-rule">Evidence \ Hypothesis</th>
            {s.hypotheses.map((h, j) => (
              <th key={j} className="px-2 py-2 border-b border-rule">
                <input value={h} onChange={(e) => setHyp(j, e.target.value)}
                  className={`font-serif italic text-[13px] text-center bg-transparent border-none outline-none w-28 ${j === minIdx ? "text-vermilion font-medium" : "text-ink"}`} />
              </th>
            ))}
            <th className="border-b border-rule" />
          </tr>
        </thead>
        <tbody>
          {s.evidence.map((e, i) => (
            <tr key={i} className="border-b border-rule">
              <td className="px-3 py-1">
                <input value={e.text} onChange={(e2) => setEv(i, { text: e2.target.value })}
                  className="font-serif italic text-[14px] bg-transparent border-none outline-none w-full" />
              </td>
              {s.hypotheses.map((_, j) => {
                const v = e.consistency[j] ?? "?";
                return (
                  <td key={j} className="text-center p-1">
                    <button onClick={() => cycleCell(i, j)}
                      data-testid={`ach-cell-${i}-${j}`}
                      aria-label={`evidence ${i + 1} hyp ${j + 1}: ${v}`}
                      className={`w-8 h-8 border font-code font-medium ${v === "-" ? "bg-paper-deep border-rule text-ink-muted" : v === "+" ? `border-ink ${j === minIdx ? "text-vermilion" : "text-ink"}` : "border-rule text-ink-muted"}`}>
                      {v}
                    </button>
                  </td>
                );
              })}
              <td className="px-2">
                <button onClick={() => rmEv(i)} aria-label="remove" className="text-ink-muted hover:text-vermilion">×</button>
              </td>
            </tr>
          ))}
          <tr>
            <td className="px-3 py-2 font-code text-[10px] tracking-[0.22em] uppercase text-vermilion font-medium">Inconsistencies</td>
            {inconsist.map((n, j) => (
              <td key={j} className="text-center font-code text-[14px] font-medium" data-testid={`ach-inconsist-${j}`}>
                <span className={j === minIdx ? "text-vermilion" : "text-ink"}>{n}</span>
              </td>
            ))}
            <td />
          </tr>
        </tbody>
      </table>
      <button onClick={addEv} className="font-serif italic text-[13px] text-ink-muted hover:text-vermilion px-3 py-2 border-t border-rule w-full text-left">+ add evidence</button>
    </div>
  );
}
