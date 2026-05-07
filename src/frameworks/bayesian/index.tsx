"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, RemoveButton, AddButton } from "@/components/ui";
import { meta, schema, sample, update, type Bayesian } from "./data";
export { meta, schema, sample };
export type { Bayesian };

export function View({ data, onUpdate }: { data: Bayesian; onUpdate?: (d: Bayesian) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Bayesian) => { setS(n); onUpdate?.(n); };
  const set = (i: number, patch: Partial<Bayesian["evidence"][number]>) =>
    upd({ ...s, evidence: s.evidence.map((e, j) => j === i ? { ...e, ...patch } : e) });
  const { posterior, trail } = update(s);

  return (
    <Card>
      <div className="border-b border-rule p-4">
        <MicroLabel>Hypothesis</MicroLabel>
        <InlineText value={s.hypothesis} onChange={(v) => upd({ ...s, hypothesis: v })} className="block w-full mt-1 font-serif text-[16px]" />
        <div className="mt-2 flex items-center gap-2">
          <MicroLabel>Prior</MicroLabel>
          <input
            type="number" step="0.05" min={0.001} max={0.999}
            value={s.prior}
            onChange={(e) => upd({ ...s, prior: Math.max(0.0001, Math.min(0.9999, Number(e.target.value) || 0.5)) })}
            data-testid="bayes-prior"
            className="w-[80px] font-code text-[14px] bg-transparent border-b border-rule outline-none"
          />
          <span className="font-code text-[10px] text-ink-muted">P(H) = {(s.prior * 100).toFixed(0)}%</span>
        </div>
      </div>
      <div className="overflow-x-auto"><table className="w-full min-w-[480px] text-[13px]">
        <thead>
          <tr className="border-b border-rule">
            <th className="p-2 text-left font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Evidence</th>
            <th className="p-2 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">P(E|H)</th>
            <th className="p-2 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">P(E|¬H)</th>
            <th className="p-2 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Observed?</th>
            <th className="p-2 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">After</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {s.evidence.map((e, i) => (
            <tr key={i} data-testid={`bayes-row-${i}`} className="border-b border-rule group">
              <td className="p-2"><InlineText value={e.name} onChange={(v) => set(i, { name: v })} /></td>
              <td className="p-2 text-center">
                <input
                  type="number" step="0.05" min={0.001} max={0.999}
                  value={e.pIfTrue}
                  onChange={(ev) => set(i, { pIfTrue: Math.max(0.0001, Math.min(0.9999, Number(ev.target.value) || 0.5)) })}
                  data-testid={`bayes-pt-${i}`}
                  className="w-[64px] font-code text-[13px] text-center bg-transparent border-b border-rule outline-none"
                />
              </td>
              <td className="p-2 text-center">
                <input
                  type="number" step="0.05" min={0.001} max={0.999}
                  value={e.pIfFalse}
                  onChange={(ev) => set(i, { pIfFalse: Math.max(0.0001, Math.min(0.9999, Number(ev.target.value) || 0.5)) })}
                  data-testid={`bayes-pf-${i}`}
                  className="w-[64px] font-code text-[13px] text-center bg-transparent border-b border-rule outline-none"
                />
              </td>
              <td className="p-2 text-center">
                <input
                  type="checkbox"
                  checked={e.observed}
                  onChange={(ev) => set(i, { observed: ev.target.checked })}
                  data-testid={`bayes-obs-${i}`}
                />
              </td>
              <td className="p-2 text-center font-code text-[13px]" data-testid={`bayes-step-${i}`}>
                {(trail[i + 1]! * 100).toFixed(0)}%
              </td>
              <td className="p-2"><RemoveButton onClick={() => upd({ ...s, evidence: s.evidence.filter((_, j) => j !== i) })} showOnHover /></td>
            </tr>
          ))}
        </tbody>
      </table></div>
      <div className="p-3 border-b border-rule">
        <AddButton onClick={() => upd({ ...s, evidence: [...s.evidence, { name: "", pIfTrue: 0.5, pIfFalse: 0.5, observed: false }] })}>
          + add evidence
        </AddButton>
      </div>
      <div className="p-6 text-center bg-vermilion/5">
        <MicroLabel accent bold>Posterior</MicroLabel>
        <p className="font-serif font-medium text-[36px] text-vermilion mt-2" data-testid="bayes-posterior">
          {(posterior * 100).toFixed(1)}%
        </p>
      </div>
    </Card>
  );
}
