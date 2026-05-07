"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, RemoveButton, AddButton } from "@/components/ui";
import { meta, schema, sample, portfolio, type Mpt } from "./data";
export { meta, schema, sample };
export type { Mpt };

export function View({ data, onUpdate }: { data: Mpt; onUpdate?: (d: Mpt) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Mpt) => { setS(n); onUpdate?.(n); };
  const set = (i: number, patch: Partial<Mpt["assets"][number]>) =>
    upd({ ...s, assets: s.assets.map((a, j) => j === i ? { ...a, ...patch } : a) });
  const p = portfolio(s);
  const off = Math.abs(p.totalW - 1) > 0.01;

  return (
    <Card>
      <div className="border-b border-rule p-4 flex items-center gap-4">
        <MicroLabel>Risk-free rate</MicroLabel>
        <input
          type="number" step="0.005"
          value={s.riskFreeRate}
          onChange={(e) => upd({ ...s, riskFreeRate: Math.max(0, Math.min(0.2, Number(e.target.value) || 0)) })}
          data-testid="mpt-rf"
          className="w-[80px] font-code text-[14px] bg-transparent border-b border-rule outline-none"
        />
        {off && <span className="ml-auto font-code text-[10px] tracking-[0.22em] uppercase text-vermilion" data-testid="mpt-warn">weights sum {(p.totalW * 100).toFixed(0)}%</span>}
      </div>
      <div className="overflow-x-auto"><table className="w-full min-w-[480px] text-[13px]">
        <thead>
          <tr className="border-b border-rule">
            <th className="p-2 text-left font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Asset</th>
            <th className="p-2 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Weight</th>
            <th className="p-2 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">E[r]</th>
            <th className="p-2 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">σ</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {s.assets.map((a, i) => (
            <tr key={i} data-testid={`mpt-row-${i}`} className="border-b border-rule group">
              <td className="p-2"><InlineText value={a.name} onChange={(v) => set(i, { name: v })} /></td>
              <td className="p-2 text-center">
                <input
                  type="number" step="0.05" min={0} max={1}
                  value={a.weight}
                  onChange={(e) => set(i, { weight: Math.max(0, Math.min(1, Number(e.target.value) || 0)) })}
                  data-testid={`mpt-w-${i}`}
                  className="w-[64px] font-code text-[13px] text-center bg-transparent border-b border-rule outline-none"
                />
              </td>
              <td className="p-2 text-center">
                <input
                  type="number" step="0.005"
                  value={a.expectedReturn}
                  onChange={(e) => set(i, { expectedReturn: Number(e.target.value) || 0 })}
                  data-testid={`mpt-er-${i}`}
                  className="w-[72px] font-code text-[13px] text-center bg-transparent border-b border-rule outline-none"
                />
              </td>
              <td className="p-2 text-center">
                <input
                  type="number" step="0.01" min={0}
                  value={a.volatility}
                  onChange={(e) => set(i, { volatility: Math.max(0, Number(e.target.value) || 0) })}
                  data-testid={`mpt-vol-${i}`}
                  className="w-[72px] font-code text-[13px] text-center bg-transparent border-b border-rule outline-none"
                />
              </td>
              <td className="p-2"><RemoveButton onClick={() => upd({ ...s, assets: s.assets.filter((_, j) => j !== i) })} showOnHover /></td>
            </tr>
          ))}
        </tbody>
      </table></div>
      <div className="p-3 border-b border-rule">
        <AddButton onClick={() => upd({ ...s, assets: [...s.assets, { name: "", weight: 0, expectedReturn: 0.05, volatility: 0.1 }] })}>
          + add asset
        </AddButton>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-3 text-center bg-vermilion/5">
        <div>
          <MicroLabel>Expected</MicroLabel>
          <p className="font-serif font-medium text-[24px] mt-1" data-testid="mpt-expected">{(p.expected * 100).toFixed(2)}%</p>
        </div>
        <div>
          <MicroLabel>σ (risk)</MicroLabel>
          <p className="font-serif font-medium text-[24px] mt-1" data-testid="mpt-stdev">{(p.stdev * 100).toFixed(2)}%</p>
        </div>
        <div>
          <MicroLabel accent bold>Sharpe</MicroLabel>
          <p className="font-serif font-medium text-[24px] mt-1 text-vermilion" data-testid="mpt-sharpe">{p.sharpe.toFixed(2)}</p>
        </div>
      </div>
    </Card>
  );
}
