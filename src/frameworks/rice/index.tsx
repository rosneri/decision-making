"use client";
import { useState } from "react";
import { meta, schema, sample, type Rice, score } from "./data";
export { meta, schema, sample };
export type { Rice };

export function View({ data, onUpdate }: { data: Rice; onUpdate?: (d: Rice) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Rice) => { setS(n); onUpdate?.(n); };
  const set = (i: number, patch: Partial<Rice["items"][number]>) =>
    upd({ ...s, items: s.items.map((it, j) => j === i ? { ...it, ...patch } : it) });
  const add = () =>
    upd({ ...s, items: [...s.items, { feature: "New idea", reach: 1000, impact: 2, confidence: 0.7, effort: 2 }] });
  const rm = (i: number) => upd({ ...s, items: s.items.filter((_, j) => j !== i) });

  const scored = s.items.map((x, i) => ({ ...x, i, score: score(x) }));
  const winner = scored.reduce((b, x) => x.score > b.score ? x : b, scored[0]!);
  const max = Math.max(...scored.map((x) => x.score));

  return (
    <div className="border-t-2 border-ink border-b border-b-ink">
      <table className="w-full border-collapse" data-testid="rice-table">
        <thead>
          <tr>
            <th className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted px-3 py-3 text-left border-b border-rule">Feature</th>
            {(["Reach", "Impact", "Conf", "Effort"] as const).map((h) => (
              <th key={h} className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted px-3 py-3 text-center border-b border-rule">{h}</th>
            ))}
            <th className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted px-3 py-3 text-right border-b border-rule">Score</th>
            <th className="border-b border-rule w-8" />
          </tr>
        </thead>
        <tbody>
          {scored.map((x) => {
            const isWinner = x.i === winner.i;
            return (
              <tr key={x.i} data-testid={`rice-row-${x.i}`}>
                <td className="px-3 py-3 border-b border-rule">
                  <div className="flex items-center gap-2">
                    {isWinner && <span className="text-vermilion">★</span>}
                    <input value={x.feature} onChange={(e) => set(x.i, { feature: e.target.value })}
                      className="font-serif italic text-[15px] bg-transparent border-none outline-none flex-1 text-ink" />
                  </div>
                </td>
                <td className="px-3 py-3 border-b border-rule text-center">
                  <input type="number" min={0} value={x.reach} onChange={(e) => set(x.i, { reach: Number(e.target.value) || 0 })}
                    className="font-code text-[13px] w-20 text-center bg-transparent border-none outline-none text-ink" />
                </td>
                <td className="px-3 py-3 border-b border-rule text-center">
                  <input type="number" min={0} max={5} step={0.5} value={x.impact} onChange={(e) => set(x.i, { impact: Number(e.target.value) || 0 })}
                    className="font-code text-[13px] w-12 text-center bg-transparent border-none outline-none text-ink" />
                </td>
                <td className="px-3 py-3 border-b border-rule text-center">
                  <input type="number" min={0} max={1} step={0.05} value={x.confidence} onChange={(e) => set(x.i, { confidence: Math.max(0, Math.min(1, Number(e.target.value) || 0)) })}
                    className="font-code text-[13px] w-14 text-center bg-transparent border-none outline-none text-ink" />
                </td>
                <td className="px-3 py-3 border-b border-rule text-center">
                  <input type="number" min={0.1} step={0.5} value={x.effort} onChange={(e) => set(x.i, { effort: Math.max(0.1, Number(e.target.value) || 0.1) })}
                    className="font-code text-[13px] w-12 text-center bg-transparent border-none outline-none text-ink" />
                </td>
                <td className={`px-3 py-3 border-b border-rule text-right font-code text-[15px] font-medium ${isWinner ? "text-vermilion" : "text-ink"}`}
                  data-testid={`rice-score-${x.i}`}>
                  {Math.round(x.score).toLocaleString()}
                </td>
                <td className="border-b border-rule text-right pr-1">
                  {s.items.length > 1 && (
                    <button onClick={() => rm(x.i)} aria-label="remove" className="text-ink-muted hover:text-vermilion">×</button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="px-3 py-3 font-code text-[11px] text-ink-muted border-b border-rule">
        score = (R × I × C) ÷ E
      </div>
      <div className="p-3 space-y-1">
        <div className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Ranked ↓</div>
        {[...scored].sort((a, b) => b.score - a.score).map((x, n) => (
          <div key={x.i} className="flex items-center gap-2">
            <span className="font-code text-[11px] text-ink-muted w-6">{n + 1}</span>
            <div className="h-1 bg-rule flex-1 max-w-[180px] relative">
              <div className={`absolute inset-y-0 left-0 ${x.i === winner.i ? "bg-vermilion" : "bg-ink"}`}
                style={{ width: `${(x.score / max) * 100}%` }} />
            </div>
            <span className="font-serif text-[13px] italic text-ink-muted">{x.feature}</span>
          </div>
        ))}
      </div>
      <button onClick={add} className="font-serif italic text-[13px] text-ink-muted hover:text-vermilion px-3 py-2 border-t border-rule w-full text-left">+ another item</button>
    </div>
  );
}
