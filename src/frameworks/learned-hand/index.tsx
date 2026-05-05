"use client";
import { useState } from "react";
import { z } from "zod";

export const meta = {
  id: "learned_hand",
  name: "Learned Hand · B < PL",
  category: "Legal & judicial",
  blurb: "If burden of precaution < probability × loss, failing to take it is negligent.",
} as const;

export const schema = z.object({
  framework: z.literal("learned_hand"),
  category: z.string(),
  title: z.string(),
  burden: z.object({ value: z.number().min(0), label: z.string() }),
  probability: z.number().min(0).max(1),
  loss: z.number().min(0),
  recommendation: z.string(),
});
export type LearnedHand = z.infer<typeof schema>;

export const sample: LearnedHand = {
  framework: "learned_hand",
  category: meta.category,
  title: "Is the warehouse owner liable for the slip-and-fall?",
  burden: { value: 2400, label: "install non-slip mats" },
  probability: 0.06,
  loss: 300000,
  recommendation: "B ($2.4k) < PL ($18k). The precaution was cheap; failing to take it is negligent under Hand.",
};

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
