"use client";
import { useState } from "react";
import { meta, schema, sample, type Pugh, cycle } from "./data";
export { meta, schema, sample };
export type { Pugh };

export function View({ data, onUpdate }: { data: Pugh; onUpdate?: (d: Pugh) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Pugh) => { setS(n); onUpdate?.(n); };
  const setName = (i: number, v: string) =>
    upd({ ...s, criteria: s.criteria.map((c, j) => j === i ? { ...c, name: v } : c) });
  const setCell = (i: number, j: number) => {
    const next = [...s.criteria[i]!.scores];
    next[j] = cycle(next[j] ?? "S");
    upd({ ...s, criteria: s.criteria.map((c, k) => k === i ? { ...c, scores: next } : c) });
  };

  const sums = s.concepts.map((_, j) => {
    let plus = 0, minus = 0;
    for (const c of s.criteria) {
      if (c.scores[j] === "+") plus++;
      else if (c.scores[j] === "-") minus++;
    }
    return { plus, minus, net: plus - minus };
  });
  const winnerIdx = sums.reduce((b, x, i) => x.net > sums[b]!.net ? i : b, 0);

  return (
    <div className="border border-ink bg-paper overflow-x-auto">
      <table className="w-full" data-testid="pugh-table">
        <thead>
          <tr className="border-b border-rule">
            <th className="text-left px-3 py-2 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Criterion</th>
            <th className="text-center px-3 py-2 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">{s.datum} (datum)</th>
            {s.concepts.map((c, j) => (
              <th key={j} className={`text-center px-3 py-2 font-code text-[10px] tracking-[0.22em] uppercase ${j === winnerIdx ? "text-vermilion" : "text-ink-muted"}`}>
                {c} {j === winnerIdx && "★"}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {s.criteria.map((c, i) => (
            <tr key={i} className="border-b border-rule">
              <td className="px-3 py-2">
                <input value={c.name} onChange={(e) => setName(i, e.target.value)}
                  className="font-serif italic text-[14px] bg-transparent border-none outline-none w-full" />
              </td>
              <td className="text-center font-code text-[13px] text-ink-muted">S</td>
              {s.concepts.map((_, j) => (
                <td key={j} className="text-center p-1">
                  <button onClick={() => setCell(i, j)}
                    data-testid={`pugh-cell-${i}-${j}`}
                    aria-label={`${c.name} vs concept ${j + 1}: ${c.scores[j] ?? "S"}`}
                    className={`w-9 h-9 border font-code font-medium ${c.scores[j] === "+" ? `border-ink ${j === winnerIdx ? "text-vermilion" : "text-ink"}` : c.scores[j] === "-" ? "border-rule text-ink-muted bg-paper-deep" : "border-rule text-ink-muted"}`}>
                    {c.scores[j] ?? "S"}
                  </button>
                </td>
              ))}
            </tr>
          ))}
          <tr className="border-b border-rule">
            <td className="px-3 py-2 font-code text-[10px] tracking-[0.22em] uppercase text-vermilion font-medium">Net</td>
            <td className="text-center font-code text-[14px] text-ink-muted">0</td>
            {sums.map((sm, j) => (
              <td key={j} className="text-center font-code text-[16px] font-medium" data-testid={`pugh-net-${j}`}>
                <span className={j === winnerIdx ? "text-vermilion" : "text-ink"}>{sm.net > 0 ? `+${sm.net}` : sm.net}</span>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
