"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, InlineNumber, AddButton, RemoveButton, ScoreBar } from "@/components/ui";
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

  const headCell = "px-3 py-3 border-b border-rule";

  return (
    <Card variant="ruled">
      <table className="w-full border-collapse" data-testid="rice-table">
        <thead>
          <tr>
            <th className={`${headCell} text-left`}><MicroLabel>Feature</MicroLabel></th>
            {(["Reach", "Impact", "Conf", "Effort"] as const).map((h) => (
              <th key={h} className={`${headCell} text-center`}><MicroLabel>{h}</MicroLabel></th>
            ))}
            <th className={`${headCell} text-right`}><MicroLabel>Score</MicroLabel></th>
            <th className="border-b border-rule w-8" />
          </tr>
        </thead>
        <tbody>
          {scored.map((x) => {
            const isWinner = x.i === winner.i;
            const cell = "px-3 py-3 border-b border-rule";
            return (
              <tr key={x.i} data-testid={`rice-row-${x.i}`}>
                <td className={cell}>
                  <div className="flex items-center gap-2">
                    {isWinner && <span className="text-vermilion">★</span>}
                    <InlineText value={x.feature} onChange={(v) => set(x.i, { feature: v })} italic size="base" />
                  </div>
                </td>
                <td className={`${cell} text-center`}>
                  <InlineNumber value={x.reach} onChange={(v) => set(x.i, { reach: v })} min={0} width="w-20" size="sm" />
                </td>
                <td className={`${cell} text-center`}>
                  <InlineNumber value={x.impact} onChange={(v) => set(x.i, { impact: v })} min={0} max={5} step={0.5} width="w-12" size="sm" />
                </td>
                <td className={`${cell} text-center`}>
                  <InlineNumber value={x.confidence} onChange={(v) => set(x.i, { confidence: v })} min={0} max={1} step={0.05} width="w-14" size="sm" />
                </td>
                <td className={`${cell} text-center`}>
                  <InlineNumber value={x.effort} onChange={(v) => set(x.i, { effort: Math.max(0.1, v) })} min={0.1} step={0.5} width="w-12" size="sm" />
                </td>
                <td
                  className={`${cell} text-right font-code text-[15px] font-medium ${isWinner ? "text-vermilion" : "text-ink"}`}
                  data-testid={`rice-score-${x.i}`}
                >
                  {Math.round(x.score).toLocaleString()}
                </td>
                <td className="border-b border-rule text-right pr-1">
                  {s.items.length > 1 && <RemoveButton onClick={() => rm(x.i)} ariaLabel="remove" />}
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
        <MicroLabel as="div">Ranked ↓</MicroLabel>
        {[...scored].sort((a, b) => b.score - a.score).map((x, n) => (
          <div key={x.i} className="flex items-center gap-2">
            <span className="font-code text-[11px] text-ink-muted w-6">{n + 1}</span>
            <ScoreBar value={x.score} max={max} highlight={x.i === winner.i} />
            <span className="font-serif text-[13px] italic text-ink-muted">{x.feature}</span>
          </div>
        ))}
      </div>
      <AddButton onClick={add} className="px-3 py-2 border-t border-rule w-full text-left">+ another item</AddButton>
    </Card>
  );
}
