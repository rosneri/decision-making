"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, InlineNumber, AddButton, RemoveButton } from "@/components/ui";
import { meta, schema, sample, type Lca } from "./data";
export { meta, schema, sample };
export type { Lca };

export function View({ data, onUpdate }: { data: Lca; onUpdate?: (d: Lca) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Lca) => { setS(n); onUpdate?.(n); };
  const set = (i: number, patch: Partial<Lca["stages"][number]>) =>
    upd({ ...s, stages: s.stages.map((x, j) => j === i ? { ...x, ...patch } : x) });
  const add = () => upd({ ...s, stages: [...s.stages, { name: "stage", impact: 5 }] });
  const rm = (i: number) => upd({ ...s, stages: s.stages.filter((_, j) => j !== i) });

  const total = s.stages.reduce((a, x) => a + x.impact, 0) || 1;
  const hotIdx = s.stages.reduce((b, x, i) => x.impact > s.stages[b]!.impact ? i : b, 0);

  return (
    <Card>
      <div className="p-4">
        <MicroLabel>{s.unit} per unit · cradle → grave</MicroLabel>
        <div className="mt-3 flex h-12 border-2 border-ink" data-testid="lca-bar">
          {s.stages.map((st, i) => (
            <div
              key={i}
              data-testid={`lca-segment-${i}`}
              className={`grid place-items-center text-paper font-code text-[10px] ${i === hotIdx ? "bg-vermilion" : i % 2 ? "bg-ink" : "bg-ink-muted"}`}
              style={{ flex: st.impact || 0.0001, borderRight: i < s.stages.length - 1 ? "1px solid var(--paper)" : "none" }}
            >
              {st.impact}
            </div>
          ))}
        </div>
        <div className="mt-1 flex">
          {s.stages.map((st, i) => (
            <span
              key={i}
              className={`text-center font-serif italic text-[12px] px-1 ${i === hotIdx ? "text-vermilion font-medium" : "text-ink-muted"}`}
              style={{ flex: st.impact || 0.0001 }}
            >
              {st.name}
            </span>
          ))}
        </div>
      </div>
      <table className="w-full border-t border-rule">
        <tbody>
          {s.stages.map((st, i) => (
            <tr key={i} className="border-b border-rule">
              <td className="px-3 py-2">
                <InlineText value={st.name} onChange={(v) => set(i, { name: v })} size="sm" />
              </td>
              <td className="px-3 py-2 text-right">
                <InlineNumber
                  value={st.impact}
                  onChange={(v) => set(i, { impact: Math.max(0, v) })}
                  min={0}
                  size="sm"
                  width="w-20"
                  className="text-right border-b border-rule"
                  testId={`lca-impact-${i}`}
                />
              </td>
              <td className="px-3 py-2 text-right font-code text-[12px] text-ink-muted w-16">{((st.impact / total) * 100).toFixed(0)}%</td>
              <td className="px-3 py-2 text-right">
                <RemoveButton onClick={() => rm(i)} ariaLabel="remove" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddButton onClick={add} className="px-3 py-2 border-t border-rule w-full text-left">+ stage</AddButton>
      <div className="p-4 border-t border-rule grid grid-cols-2">
        <div>
          <MicroLabel>Total</MicroLabel>
          <div className="font-serif font-medium text-[20px] text-ink mt-1" data-testid="lca-total">{total} {s.unit}</div>
        </div>
        <div className="border-l border-vermilion pl-4">
          <MicroLabel accent bold>Hotspot</MicroLabel>
          <div className="font-serif font-medium text-[20px] text-vermilion mt-1" data-testid="lca-hotspot">{s.stages[hotIdx]?.name}</div>
        </div>
      </div>
    </Card>
  );
}
