"use client";
import { useState } from "react";
import { Card, InlineText, RemoveButton, AddButton } from "@/components/ui";
import { meta, schema, sample, score, type Ice } from "./data";
export { meta, schema, sample };
export type { Ice };

export function View({ data, onUpdate }: { data: Ice; onUpdate?: (d: Ice) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Ice) => { setS(n); onUpdate?.(n); };
  const set = (i: number, patch: Partial<Ice["ideas"][number]>) =>
    upd({ ...s, ideas: s.ideas.map((x, j) => j === i ? { ...x, ...patch } : x) });

  const ranked = s.ideas.map((it, i) => ({ it, i, sc: score(it) })).sort((a, b) => b.sc - a.sc);
  const topScore = ranked[0]?.sc ?? 0;

  return (
    <Card>
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-rule">
            <th className="p-2 text-left font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Idea</th>
            <th className="p-2 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Impact</th>
            <th className="p-2 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Confidence</th>
            <th className="p-2 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Ease</th>
            <th className="p-2 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Score</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {ranked.map(({ it, i, sc }) => {
            const top = sc === topScore;
            return (
              <tr key={i} data-testid={`ice-row-${i}`} className={`border-b border-rule group ${top ? "bg-vermilion/5" : ""}`}>
                <td className="p-2"><InlineText value={it.name} onChange={(v) => set(i, { name: v })} className={top ? "text-vermilion font-medium" : ""} /></td>
                {(["impact", "confidence", "ease"] as const).map((k) => (
                  <td key={k} className="p-2 text-center">
                    <input
                      type="number" min={1} max={10}
                      value={it[k]}
                      onChange={(e) => set(i, { [k]: Math.max(1, Math.min(10, Number(e.target.value) || 1)) })}
                      data-testid={`ice-${k[0]}-${i}`}
                      className="w-[44px] font-code text-[13px] text-center bg-transparent border-b border-rule outline-none"
                    />
                  </td>
                ))}
                <td className="p-2 text-center">
                  <span data-testid={`ice-score-${i}`} className={`font-serif font-medium text-[18px] ${top ? "text-vermilion" : ""}`}>{sc}</span>
                </td>
                <td className="p-2"><RemoveButton onClick={() => upd({ ...s, ideas: s.ideas.filter((_, j) => j !== i) })} showOnHover /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="p-3">
        <AddButton onClick={() => upd({ ...s, ideas: [...s.ideas, { name: "", impact: 5, confidence: 5, ease: 5 }] })}>
          + add idea
        </AddButton>
      </div>
    </Card>
  );
}
