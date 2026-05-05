"use client";
import { useState } from "react";
import { meta, schema, sample, type CostSensitive } from "./data";
export { meta, schema, sample };
export type { CostSensitive };

export function View({ data, onUpdate }: { data: CostSensitive; onUpdate?: (d: CostSensitive) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: CostSensitive) => { setS(n); onUpdate?.(n); };
  // Simple expected $ proxy across thresholds
  const ev = (t: number) => {
    const p = s.baseRate;
    const tp = (1 - t) * p * s.payoffs.truePos;
    const fn = t * p * s.payoffs.falseNeg;
    const fp = (1 - t) * (1 - p) * s.payoffs.falsePos;
    const tn = t * (1 - p) * s.payoffs.trueNeg;
    return tp + fn + fp + tn;
  };
  const evNow = ev(s.threshold);

  // Find best threshold (grid)
  let best = 0, bestVal = -Infinity;
  for (let t = 0; t <= 1.001; t += 0.01) {
    const v = ev(t);
    if (v > bestVal) { bestVal = v; best = t; }
  }

  return (
    <div className="border border-ink bg-paper">
      <div className="p-4 border-b border-rule">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Confusion-matrix payoffs</span>
        <div className="grid grid-cols-3 gap-2 mt-2">
          <div />
          <div className="font-code text-[10px] tracking-[0.18em] uppercase text-ink-muted text-center">actually positive</div>
          <div className="font-code text-[10px] tracking-[0.18em] uppercase text-ink-muted text-center">actually negative</div>
          {(["flag", "let go"] as const).map((row) => (
            <div key={row} className="contents">
              <div className="font-code text-[10px] tracking-[0.18em] uppercase text-ink-muted">{row}</div>
              {(["truePos", "falsePos", "falseNeg", "trueNeg"] as const).slice(row === "flag" ? 0 : 2, row === "flag" ? 2 : 4).map((k) => (
                <label key={k} className="border border-rule p-2 text-center">
                  <span className="font-code text-[10px] text-ink-muted block">{k}</span>
                  <input type="number" value={s.payoffs[k]}
                    onChange={(e) => upd({ ...s, payoffs: { ...s.payoffs, [k]: Number(e.target.value) || 0 } })}
                    data-testid={`cs-${k}`}
                    className="font-code text-[14px] w-full text-center bg-transparent border-none outline-none text-ink" />
                </label>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 grid grid-cols-2 gap-4 border-b border-rule">
        <label>
          <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Base rate</span>
          <input type="range" min={0} max={1} step={0.01} value={s.baseRate}
            onChange={(e) => upd({ ...s, baseRate: Number(e.target.value) })}
            data-testid="cs-baserate"
            aria-label="base rate"
            className="block w-full" />
          <span className="font-code text-[12px] text-ink-muted">{(s.baseRate * 100).toFixed(1)}%</span>
        </label>
        <label>
          <span className="font-code text-[10px] tracking-[0.22em] uppercase text-vermilion font-medium">Threshold</span>
          <input type="range" min={0} max={1} step={0.01} value={s.threshold}
            onChange={(e) => upd({ ...s, threshold: Number(e.target.value) })}
            data-testid="cs-threshold"
            aria-label="threshold"
            className="block w-full" />
          <span className="font-code text-[12px] text-vermilion">{s.threshold.toFixed(2)}</span>
        </label>
      </div>
      <div className="grid grid-cols-2">
        <div className="p-4">
          <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Expected $ at current</span>
          <div className="font-serif font-medium text-[24px] text-ink mt-1" data-testid="cs-ev">{evNow.toFixed(2)}</div>
        </div>
        <div className="p-4 bg-vermilion/5 border-l border-vermilion">
          <span className="font-code text-[10px] tracking-[0.22em] uppercase text-vermilion font-medium">Best threshold</span>
          <div className="font-serif font-medium text-[24px] text-vermilion mt-1" data-testid="cs-best">t* = {best.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}
