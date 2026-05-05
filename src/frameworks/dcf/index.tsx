"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineNumber, AddButton } from "@/components/ui";
import { meta, schema, sample, type Dcf } from "./data";
export { meta, schema, sample };
export type { Dcf };

export function View({ data, onUpdate }: { data: Dcf; onUpdate?: (d: Dcf) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Dcf) => { setS(n); onUpdate?.(n); };

  const r = s.discountRate;
  const pvs = s.fcf.map((v, i) => v / Math.pow(1 + r, i + 1));
  const pvTV = s.terminalValue / Math.pow(1 + r, s.fcf.length);
  const sumPV = pvs.reduce((a, b) => a + b, 0) + pvTV;
  const buy = sumPV > s.askingPrice;

  const setFcf = (i: number, v: number) =>
    upd({ ...s, fcf: s.fcf.map((x, j) => j === i ? v : x) });
  const addYear = () => upd({ ...s, fcf: [...s.fcf, 0] });
  const rmYear = () => s.fcf.length > 1 && upd({ ...s, fcf: s.fcf.slice(0, -1) });

  const headerNum = "block mt-1 font-serif font-medium text-[24px] bg-transparent border-b border-rule outline-none w-full text-ink";

  return (
    <Card>
      <div className="grid grid-cols-3 divide-x divide-rule border-b border-rule">
        <label className="p-3">
          <MicroLabel>Discount rate</MicroLabel>
          <input
            type="number"
            min={0}
            max={1}
            step={0.01}
            value={s.discountRate}
            onChange={(e) => upd({ ...s, discountRate: Math.max(0, Math.min(1, Number(e.target.value) || 0)) })}
            data-testid="dcf-rate"
            className={headerNum}
          />
          <span className="font-code text-[11px] text-ink-muted">{(r * 100).toFixed(1)}%</span>
        </label>
        <label className="p-3">
          <MicroLabel>Terminal value</MicroLabel>
          <input
            type="number"
            value={s.terminalValue}
            onChange={(e) => upd({ ...s, terminalValue: Number(e.target.value) || 0 })}
            className={headerNum}
          />
        </label>
        <label className="p-3">
          <MicroLabel>Asking price</MicroLabel>
          <input
            type="number"
            min={0}
            value={s.askingPrice}
            onChange={(e) => upd({ ...s, askingPrice: Math.max(0, Number(e.target.value) || 0) })}
            data-testid="dcf-asking"
            className={headerNum}
          />
        </label>
      </div>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left px-3 py-2"><MicroLabel>Year</MicroLabel></th>
            {s.fcf.map((_, i) => <th key={i} className="font-code text-[11px] text-center py-2">Y{i + 1}</th>)}
            <th className="text-right pr-3"><MicroLabel>TV</MicroLabel></th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-rule">
            <td className="px-3 py-2 font-serif italic text-[13px] text-ink-muted">FCF</td>
            {s.fcf.map((v, i) => (
              <td key={i} className="text-center py-2">
                <InlineNumber
                  value={v}
                  onChange={(nv) => setFcf(i, nv)}
                  size="sm"
                  width="w-14"
                  testId={`dcf-fcf-${i}`}
                  className="border-b border-rule"
                />
              </td>
            ))}
            <td className="text-right pr-3 font-code text-[13px]">{s.terminalValue}</td>
          </tr>
          <tr className="border-t border-rule">
            <td className="px-3 py-2 font-serif italic text-[13px] text-ink-muted">PV</td>
            {pvs.map((v, i) => (
              <td key={i} className="text-center py-2 font-code text-[13px] text-vermilion font-medium">{v.toFixed(1)}</td>
            ))}
            <td className="text-right pr-3 font-code text-[13px] text-vermilion font-medium">{pvTV.toFixed(1)}</td>
          </tr>
        </tbody>
      </table>
      <div className="flex gap-2 px-3 py-2 border-t border-rule">
        <AddButton onClick={addYear}>+ year</AddButton>
        <AddButton onClick={rmYear}>− last year</AddButton>
      </div>
      <div className="grid grid-cols-2 border-t border-rule">
        <div className="p-4">
          <MicroLabel>Sum PV</MicroLabel>
          <div className="font-serif font-medium text-[28px] text-ink mt-1" data-testid="dcf-sumpv">{s.unit}{sumPV.toFixed(1)}</div>
        </div>
        <div className={`p-4 border-l ${buy ? "bg-vermilion/5 border-l-vermilion" : "border-l-rule"}`}>
          <MicroLabel accent={buy} bold>vs asking</MicroLabel>
          <div className={`font-serif font-medium text-[28px] mt-1 ${buy ? "text-vermilion" : "text-ink"}`} data-testid="dcf-verdict">
            {s.unit}{s.askingPrice} · {buy ? "✓ buy" : "✗ pass"}
          </div>
        </div>
      </div>
    </Card>
  );
}
