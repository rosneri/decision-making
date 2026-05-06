"use client";
import { useState } from "react";
import { Card, MicroLabel } from "@/components/ui";
import { meta, schema, sample, fireMath, type FourPercent } from "./data";
export { meta, schema, sample };
export type { FourPercent };

function NumField({ label, value, step, onChange, testId, suffix }: {
  label: string; value: number; step: number; onChange: (v: number) => void; testId: string; suffix?: string;
}) {
  return (
    <label className="block">
      <MicroLabel>{label}</MicroLabel>
      <div className="flex items-baseline gap-1">
        <input
          type="number"
          value={value}
          step={step}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          data-testid={testId}
          className="block w-full font-code text-[16px] bg-transparent border-b border-rule outline-none focus:border-vermilion"
        />
        {suffix && <span className="font-code text-[10px] text-ink-muted">{suffix}</span>}
      </div>
    </label>
  );
}

export function View({ data, onUpdate }: { data: FourPercent; onUpdate?: (d: FourPercent) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: FourPercent) => { setS(n); onUpdate?.(n); };
  const { target, years } = fireMath(s);

  return (
    <Card>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border-b border-rule">
        <NumField label="Annual spend" value={s.annualSpend} step={1000} onChange={(v) => upd({ ...s, annualSpend: v })} testId="fp-spend" suffix="$/yr" />
        <NumField label="Withdrawal rate" value={s.withdrawalRate} step={0.005} onChange={(v) => upd({ ...s, withdrawalRate: Math.max(0.01, Math.min(0.1, v)) })} testId="fp-rate" suffix="(0.04 = 4%)" />
        <NumField label="Current savings" value={s.currentSavings} step={1000} onChange={(v) => upd({ ...s, currentSavings: v })} testId="fp-savings" suffix="$" />
        <NumField label="Monthly add" value={s.monthlyContribution} step={100} onChange={(v) => upd({ ...s, monthlyContribution: v })} testId="fp-monthly" suffix="$/mo" />
        <NumField label="Expected return" value={s.expectedReturn} step={0.005} onChange={(v) => upd({ ...s, expectedReturn: Math.max(0, Math.min(0.2, v)) })} testId="fp-return" suffix="(real)" />
      </div>
      <div className="grid grid-cols-2 divide-x divide-rule">
        <div className="p-6 text-center">
          <MicroLabel>FIRE target</MicroLabel>
          <p className="font-serif font-medium text-[36px] mt-2" data-testid="fp-target">
            ${Math.round(target).toLocaleString()}
          </p>
          <p className="font-serif italic text-[12px] text-ink-muted mt-1">
            = annual spend ÷ withdrawal rate
          </p>
        </div>
        <div className="p-6 text-center bg-vermilion/5">
          <MicroLabel accent bold>Years to FIRE</MicroLabel>
          <p className="font-serif font-medium text-[36px] mt-2 text-vermilion" data-testid="fp-years">
            {years.toFixed(1)}
          </p>
          <p className="font-serif italic text-[12px] text-ink-muted mt-1">
            at current savings + monthly contribution
          </p>
        </div>
      </div>
    </Card>
  );
}
