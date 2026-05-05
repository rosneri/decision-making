"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, InlineNumber, AddButton, RemoveButton } from "@/components/ui";
import { meta, schema, sample, type ReferenceClass } from "./data";
export { meta, schema, sample };
export type { ReferenceClass };

export function View({ data, onUpdate }: { data: ReferenceClass; onUpdate?: (d: ReferenceClass) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: ReferenceClass) => { setS(n); onUpdate?.(n); };
  const set = (i: number, patch: Partial<ReferenceClass["pastProjects"][number]>) =>
    upd({ ...s, pastProjects: s.pastProjects.map((p, j) => j === i ? { ...p, ...patch } : p) });
  const add = () => upd({ ...s, pastProjects: [...s.pastProjects, { name: "Project", estimate: 10, actual: 15 }] });
  const rm = (i: number) => upd({ ...s, pastProjects: s.pastProjects.filter((_, j) => j !== i) });

  const totalEst = s.pastProjects.reduce((a, p) => a + p.estimate, 0) || 1;
  const totalAct = s.pastProjects.reduce((a, p) => a + p.actual, 0);
  const ratio = totalAct / totalEst;
  const adjusted = s.yourEstimate * ratio;

  const head = "px-3 py-2 border-b border-rule";

  return (
    <Card>
      <table className="w-full">
        <thead>
          <tr>
            <th className={`${head} text-left`}><MicroLabel>Past project</MicroLabel></th>
            <th className={`${head} text-center`}><MicroLabel>Estimate</MicroLabel></th>
            <th className={`${head} text-center`}><MicroLabel>Actual</MicroLabel></th>
            <th className={`${head} text-right`}><MicroLabel>Ratio</MicroLabel></th>
            <th className="border-b border-rule" />
          </tr>
        </thead>
        <tbody>
          {s.pastProjects.map((p, i) => (
            <tr key={i} className="border-b border-rule" data-testid={`refclass-row-${i}`}>
              <td className="px-3 py-2">
                <InlineText value={p.name} onChange={(v) => set(i, { name: v })} italic size="sm" />
              </td>
              <td className="px-3 py-2 text-center">
                <InlineNumber
                  value={p.estimate}
                  onChange={(v) => set(i, { estimate: Math.max(0, v) })}
                  min={0}
                  size="sm"
                  width="w-16"
                />
              </td>
              <td className="px-3 py-2 text-center">
                <InlineNumber
                  value={p.actual}
                  onChange={(v) => set(i, { actual: Math.max(0, v) })}
                  min={0}
                  size="sm"
                  width="w-16"
                />
              </td>
              <td className="px-3 py-2 text-right font-code text-[13px] text-ink-muted">
                {(p.actual / (p.estimate || 1)).toFixed(2)}×
              </td>
              <td className="px-3 py-2 text-right">
                <RemoveButton onClick={() => rm(i)} ariaLabel="remove" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddButton onClick={add} className="px-3 py-2 w-full text-left border-b border-rule">+ add project</AddButton>
      <div className="bg-vermilion/5 border-t border-vermilion p-4 grid grid-cols-3 gap-4">
        <div>
          <MicroLabel>Your estimate</MicroLabel>
          <div className="flex items-baseline gap-2 mt-1">
            <input
              type="number"
              min={0}
              value={s.yourEstimate}
              onChange={(e) => upd({ ...s, yourEstimate: Math.max(0, Number(e.target.value) || 0) })}
              data-testid="refclass-your-estimate"
              className="font-serif font-medium text-[28px] w-20 bg-transparent border-b border-rule outline-none text-ink"
            />
            <span className="font-code text-[12px] text-ink-muted">{s.unit}</span>
          </div>
        </div>
        <div>
          <MicroLabel>Base-rate ratio</MicroLabel>
          <div className="font-serif font-medium text-[28px] text-ink mt-1">{ratio.toFixed(2)}×</div>
        </div>
        <div>
          <MicroLabel accent>Adjusted</MicroLabel>
          <div className="font-serif font-medium text-[28px] text-vermilion mt-1" data-testid="refclass-adjusted">
            {adjusted.toFixed(1)} {s.unit}
          </div>
        </div>
      </div>
    </Card>
  );
}
