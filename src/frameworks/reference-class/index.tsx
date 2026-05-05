"use client";
import { useState } from "react";
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

  return (
    <div className="border border-ink bg-paper">
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left px-3 py-2 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted border-b border-rule">Past project</th>
            <th className="text-center px-3 py-2 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted border-b border-rule">Estimate</th>
            <th className="text-center px-3 py-2 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted border-b border-rule">Actual</th>
            <th className="text-right px-3 py-2 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted border-b border-rule">Ratio</th>
            <th className="border-b border-rule" />
          </tr>
        </thead>
        <tbody>
          {s.pastProjects.map((p, i) => (
            <tr key={i} className="border-b border-rule" data-testid={`refclass-row-${i}`}>
              <td className="px-3 py-2">
                <input value={p.name} onChange={(e) => set(i, { name: e.target.value })}
                  className="font-serif italic text-[14px] bg-transparent border-none outline-none w-full" />
              </td>
              <td className="px-3 py-2 text-center">
                <input type="number" min={0} value={p.estimate} onChange={(e) => set(i, { estimate: Math.max(0, Number(e.target.value) || 0) })}
                  className="font-code text-[13px] w-16 text-center bg-transparent border-none outline-none" />
              </td>
              <td className="px-3 py-2 text-center">
                <input type="number" min={0} value={p.actual} onChange={(e) => set(i, { actual: Math.max(0, Number(e.target.value) || 0) })}
                  className="font-code text-[13px] w-16 text-center bg-transparent border-none outline-none" />
              </td>
              <td className="px-3 py-2 text-right font-code text-[13px] text-ink-muted">
                {(p.actual / (p.estimate || 1)).toFixed(2)}×
              </td>
              <td className="px-3 py-2 text-right">
                <button onClick={() => rm(i)} aria-label="remove" className="text-ink-muted hover:text-vermilion">×</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={add} className="font-serif italic text-[13px] text-ink-muted hover:text-vermilion px-3 py-2 w-full text-left border-b border-rule">+ add project</button>
      <div className="bg-vermilion/5 border-t border-vermilion p-4 grid grid-cols-3 gap-4">
        <div>
          <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Your estimate</span>
          <div className="flex items-baseline gap-2 mt-1">
            <input type="number" min={0} value={s.yourEstimate}
              onChange={(e) => upd({ ...s, yourEstimate: Math.max(0, Number(e.target.value) || 0) })}
              data-testid="refclass-your-estimate"
              className="font-serif font-medium text-[28px] w-20 bg-transparent border-b border-rule outline-none text-ink" />
            <span className="font-code text-[12px] text-ink-muted">{s.unit}</span>
          </div>
        </div>
        <div>
          <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Base-rate ratio</span>
          <div className="font-serif font-medium text-[28px] text-ink mt-1">{ratio.toFixed(2)}×</div>
        </div>
        <div>
          <span className="font-code text-[10px] tracking-[0.22em] uppercase text-vermilion">Adjusted</span>
          <div className="font-serif font-medium text-[28px] text-vermilion mt-1" data-testid="refclass-adjusted">
            {adjusted.toFixed(1)} {s.unit}
          </div>
        </div>
      </div>
    </div>
  );
}
