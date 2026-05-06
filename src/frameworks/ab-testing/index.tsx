"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText } from "@/components/ui";
import { meta, schema, sample, stats, type AbTesting } from "./data";
export { meta, schema, sample };
export type { AbTesting };

function Arm({ name, n, conversions, onN, onC, rate, testId, accent }: {
  name: string; n: number; conversions: number;
  onN: (v: number) => void; onC: (v: number) => void;
  rate: number; testId: string; accent?: boolean;
}) {
  return (
    <div data-testid={testId} className={`p-4 ${accent ? "bg-vermilion/5 border-l border-vermilion" : ""}`}>
      <MicroLabel accent={accent} bold={accent}>{name}</MicroLabel>
      <div className="mt-2 grid grid-cols-2 gap-3">
        <label className="block">
          <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">N</span>
          <input
            type="number"
            value={n}
            onChange={(e) => onN(Math.max(1, Number(e.target.value) || 1))}
            data-testid={`${testId}-n`}
            className="block w-full font-code text-[14px] bg-transparent border-b border-rule outline-none"
          />
        </label>
        <label className="block">
          <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">conversions</span>
          <input
            type="number"
            value={conversions}
            onChange={(e) => onC(Math.max(0, Number(e.target.value) || 0))}
            data-testid={`${testId}-c`}
            className="block w-full font-code text-[14px] bg-transparent border-b border-rule outline-none"
          />
        </label>
      </div>
      <div className="mt-3 font-serif text-[24px] font-medium" data-testid={`${testId}-rate`}>
        {(rate * 100).toFixed(2)}%
      </div>
    </div>
  );
}

export function View({ data, onUpdate }: { data: AbTesting; onUpdate?: (d: AbTesting) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: AbTesting) => { setS(n); onUpdate?.(n); };
  const r = stats(s);

  return (
    <Card>
      <div className="border-b border-rule p-4">
        <MicroLabel>Hypothesis</MicroLabel>
        <InlineText
          value={s.hypothesis}
          onChange={(v) => upd({ ...s, hypothesis: v })}
          className="block w-full mt-1 font-serif text-[16px]"
        />
        <div className="mt-2 flex items-center gap-4">
          <MicroLabel>Metric</MicroLabel>
          <InlineText value={s.metric} onChange={(v) => upd({ ...s, metric: v })} className="text-[13px]" />
          <span className="ml-auto font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">α =
            <input
              type="number"
              step="0.01"
              value={s.alpha}
              onChange={(e) => upd({ ...s, alpha: Math.max(0.001, Math.min(0.5, Number(e.target.value) || 0.05)) })}
              data-testid="ab-alpha"
              className="w-[60px] ml-2 font-code text-[13px] bg-transparent border-b border-rule outline-none"
            />
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-rule">
        <Arm
          name="Control"
          n={s.control.n}
          conversions={s.control.conversions}
          rate={r.pC}
          testId="ab-control"
          onN={(v) => upd({ ...s, control: { ...s.control, n: v } })}
          onC={(v) => upd({ ...s, control: { ...s.control, conversions: v } })}
        />
        <Arm
          name="Treatment"
          n={s.treatment.n}
          conversions={s.treatment.conversions}
          rate={r.pT}
          testId="ab-treatment"
          accent
          onN={(v) => upd({ ...s, treatment: { ...s.treatment, n: v } })}
          onC={(v) => upd({ ...s, treatment: { ...s.treatment, conversions: v } })}
        />
      </div>
      <div className="border-t border-rule p-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <MicroLabel>Lift</MicroLabel>
          <p className="font-serif font-medium text-[24px] mt-1" data-testid="ab-lift">{(r.lift * 100).toFixed(1)}%</p>
        </div>
        <div>
          <MicroLabel>p-value</MicroLabel>
          <p className="font-serif font-medium text-[24px] mt-1" data-testid="ab-p">{r.p.toFixed(3)}</p>
        </div>
        <div>
          <MicroLabel>Verdict</MicroLabel>
          <p
            data-testid="ab-verdict"
            className={`font-serif font-medium text-[24px] mt-1 ${r.significant ? "text-vermilion" : "text-ink-muted"}`}
          >
            {r.significant ? "ship" : "hold"}
          </p>
        </div>
      </div>
    </Card>
  );
}
