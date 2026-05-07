"use client";
import { useState } from "react";
import { Card, MicroLabel, BigNumber } from "@/components/ui";
import { meta, schema, sample, type Budget } from "./data";
export { meta, schema, sample };
export type { Budget };

export function View({ data, onUpdate }: { data: Budget; onUpdate?: (d: Budget) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Budget) => { setS(n); onUpdate?.(n); };
  const total = s.actuals.needs + s.actuals.wants + s.actuals.save || 1;
  const pct = (v: number) => (v / total) * 100;

  const target = { needs: 0.5, wants: 0.3, save: 0.2 };
  const targetAmt = (k: keyof Budget["actuals"]) => s.income * target[k];
  const delta = (k: keyof Budget["actuals"]) => s.actuals[k] - targetAmt(k);

  return (
    <Card>
      <div className="p-4 border-b border-rule">
        <label>
          <MicroLabel>Take-home / month</MicroLabel>
          <BigNumber
            value={s.income}
            onChange={(v) => upd({ ...s, income: Math.max(0, v) })}
            min={0}
            size="lg"
            width="w-32"
            className="mt-1"
            testId="budget-income"
          />
        </label>
      </div>
      <div className="p-4">
        <div className="flex h-12 border-2 border-ink" data-testid="budget-bar">
          <div className="bg-ink grid place-items-center text-paper font-code text-[11px]" style={{ width: `${pct(s.actuals.needs)}%` }}>
            {pct(s.actuals.needs).toFixed(0)}%
          </div>
          <div className="bg-ink-muted grid place-items-center text-paper font-code text-[11px]" style={{ width: `${pct(s.actuals.wants)}%` }}>
            {pct(s.actuals.wants).toFixed(0)}%
          </div>
          <div className="bg-vermilion grid place-items-center text-paper font-code text-[11px]" style={{ width: `${pct(s.actuals.save)}%` }}>
            {pct(s.actuals.save).toFixed(0)}%
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(["needs", "wants", "save"] as const).map((k, i) => (
            <label key={k} className={`p-3 border ${i === 2 ? "border-vermilion bg-vermilion/5" : "border-rule"}`}>
              <MicroLabel accent={i === 2} bold>
                {k} · {Math.round(target[k] * 100)}%
              </MicroLabel>
              <BigNumber
                value={s.actuals[k]}
                onChange={(v) => upd({ ...s, actuals: { ...s.actuals, [k]: Math.max(0, v) } })}
                min={0}
                size="md"
                className="mt-1"
                testId={`budget-${k}`}
              />
              <span className={`font-code text-[11px] ${delta(k) > 1 ? "text-vermilion" : delta(k) < -1 ? "text-ink-muted" : "text-ink"}`}>
                target ${targetAmt(k).toFixed(0)} · Δ {delta(k) > 0 ? "+" : ""}{delta(k).toFixed(0)}
              </span>
            </label>
          ))}
        </div>
      </div>
    </Card>
  );
}
