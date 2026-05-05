"use client";
import { useState } from "react";
import { z } from "zod";

export const meta = {
  id: "dcf",
  name: "DCF / NPV",
  category: "Financial & investment",
  blurb: "Sum the present value of future cash flows; compare to asking price.",
} as const;

export const schema = z.object({
  framework: z.literal("dcf"),
  category: z.string(),
  title: z.string(),
  unit: z.string(),
  fcf: z.array(z.number()).min(1).max(20),
  terminalValue: z.number(),
  discountRate: z.number().min(0).max(1),
  askingPrice: z.number().min(0),
  recommendation: z.string(),
});
export type Dcf = z.infer<typeof schema>;

export const sample: Dcf = {
  framework: "dcf",
  category: meta.category,
  title: "Is this SaaS company worth $80M?",
  unit: "$M",
  fcf: [12, 14, 17, 19, 21],
  terminalValue: 240,
  discountRate: 0.10,
  askingPrice: 80,
  recommendation: "PV sums to ~$210M against $80M asking — significant margin of safety. Buy if fundamentals hold.",
};

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

  return (
    <div className="border border-ink bg-paper">
      <div className="grid grid-cols-3 divide-x divide-rule border-b border-rule">
        <label className="p-3">
          <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Discount rate</span>
          <input type="number" min={0} max={1} step={0.01} value={s.discountRate}
            onChange={(e) => upd({ ...s, discountRate: Math.max(0, Math.min(1, Number(e.target.value) || 0)) })}
            data-testid="dcf-rate"
            className="block mt-1 font-serif font-medium text-[24px] bg-transparent border-b border-rule outline-none w-full text-ink" />
          <span className="font-code text-[11px] text-ink-muted">{(r * 100).toFixed(1)}%</span>
        </label>
        <label className="p-3">
          <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Terminal value</span>
          <input type="number" value={s.terminalValue}
            onChange={(e) => upd({ ...s, terminalValue: Number(e.target.value) || 0 })}
            className="block mt-1 font-serif font-medium text-[24px] bg-transparent border-b border-rule outline-none w-full text-ink" />
        </label>
        <label className="p-3">
          <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Asking price</span>
          <input type="number" min={0} value={s.askingPrice}
            onChange={(e) => upd({ ...s, askingPrice: Math.max(0, Number(e.target.value) || 0) })}
            data-testid="dcf-asking"
            className="block mt-1 font-serif font-medium text-[24px] bg-transparent border-b border-rule outline-none w-full text-ink" />
        </label>
      </div>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left px-3 py-2 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Year</th>
            {s.fcf.map((_, i) => <th key={i} className="font-code text-[11px] text-center py-2">Y{i + 1}</th>)}
            <th className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted text-right pr-3">TV</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-rule">
            <td className="px-3 py-2 font-serif italic text-[13px] text-ink-muted">FCF</td>
            {s.fcf.map((v, i) => (
              <td key={i} className="text-center py-2">
                <input type="number" value={v} onChange={(e) => setFcf(i, Number(e.target.value) || 0)}
                  data-testid={`dcf-fcf-${i}`}
                  className="font-code text-[13px] w-14 text-center bg-transparent border-b border-rule outline-none text-ink" />
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
        <button onClick={addYear} className="font-serif italic text-[13px] text-ink-muted hover:text-vermilion">+ year</button>
        <button onClick={rmYear} className="font-serif italic text-[13px] text-ink-muted hover:text-vermilion">− last year</button>
      </div>
      <div className="grid grid-cols-2 border-t border-rule">
        <div className="p-4">
          <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Sum PV</span>
          <div className="font-serif font-medium text-[28px] text-ink mt-1" data-testid="dcf-sumpv">{s.unit}{sumPV.toFixed(1)}</div>
        </div>
        <div className={`p-4 border-l ${buy ? "bg-vermilion/5 border-l-vermilion" : "border-l-rule"}`}>
          <span className={`font-code text-[10px] tracking-[0.22em] uppercase font-medium ${buy ? "text-vermilion" : "text-ink-muted"}`}>vs asking</span>
          <div className={`font-serif font-medium text-[28px] mt-1 ${buy ? "text-vermilion" : "text-ink"}`} data-testid="dcf-verdict">
            {s.unit}{s.askingPrice} · {buy ? "✓ buy" : "✗ pass"}
          </div>
        </div>
      </div>
    </div>
  );
}
