"use client";
import { useState } from "react";
import { meta, schema, sample, type LearnedHand } from "./data";
export { meta, schema, sample };
export type { LearnedHand };

export function View({ data, onUpdate }: { data: LearnedHand; onUpdate?: (d: LearnedHand) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: LearnedHand) => { setS(n); onUpdate?.(n); };

  const pl = s.probability * s.loss;
  const negligent = s.burden.value < pl;

  return (
    <div className="border border-ink bg-paper">
      <div className="grid grid-cols-3 divide-x divide-rule items-stretch">
        <div className="p-4">
          <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">B · Burden of precaution</span>
          <input type="number" min={0} value={s.burden.value}
            onChange={(e) => upd({ ...s, burden: { ...s.burden, value: Math.max(0, Number(e.target.value) || 0) } })}
            data-testid="lh-burden"
            className="block w-full mt-1 font-serif font-medium text-[28px] bg-transparent border-b border-rule outline-none focus:border-vermilion text-ink" />
          <input value={s.burden.label} onChange={(e) => upd({ ...s, burden: { ...s.burden, label: e.target.value } })}
            className="block w-full mt-1 font-serif italic text-[13px] text-ink-muted bg-transparent border-none outline-none" />
        </div>
        <div className="grid place-items-center">
          <span className={`font-serif text-[40px] ${negligent ? "text-vermilion" : "text-ink"}`} data-testid="lh-comparator">
            {negligent ? "<" : "≥"}
          </span>
        </div>
        <div className="p-4">
          <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">P × L</span>
          <div className="mt-1 font-serif font-medium text-[28px] text-ink" data-testid="lh-pl">
            {pl.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <label>
              <span className="font-code text-[10px] tracking-[0.18em] uppercase text-ink-muted">P</span>
              <input type="number" min={0} max={1} step={0.01} value={s.probability}
                onChange={(e) => upd({ ...s, probability: Math.max(0, Math.min(1, Number(e.target.value) || 0)) })}
                data-testid="lh-probability"
                className="block w-full font-code text-[13px] bg-transparent border-b border-rule outline-none" />
            </label>
            <label>
              <span className="font-code text-[10px] tracking-[0.18em] uppercase text-ink-muted">L</span>
              <input type="number" min={0} value={s.loss}
                onChange={(e) => upd({ ...s, loss: Math.max(0, Number(e.target.value) || 0) })}
                data-testid="lh-loss"
                className="block w-full font-code text-[13px] bg-transparent border-b border-rule outline-none" />
            </label>
          </div>
        </div>
      </div>
      <div className={`p-4 border-t border-ink ${negligent ? "bg-vermilion text-paper" : "bg-paper-deep"}`} data-testid="lh-verdict">
        <div className="font-serif font-medium text-[20px]">
          B ({s.burden.value.toLocaleString()}) {negligent ? "<" : "≥"} PL ({pl.toLocaleString(undefined, { maximumFractionDigits: 0 })})
        </div>
        <div className="font-serif italic text-[13px] mt-1">
          {negligent ? "∴ failure to take the precaution was negligent" : "∴ no negligence under Hand"}
        </div>
      </div>
    </div>
  );
}
