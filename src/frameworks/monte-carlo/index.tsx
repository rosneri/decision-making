"use client";
import { useState, useMemo } from "react";
import { Card, MicroLabel } from "@/components/ui";
import { meta, schema, sample, type MonteCarlo, box } from "./data";
export { meta, schema, sample };
export type { MonteCarlo };

export function View({ data, onUpdate }: { data: MonteCarlo; onUpdate?: (d: MonteCarlo) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: MonteCarlo) => { setS(n); onUpdate?.(n); };

  const { bins, p10, p50, p90, pSuccess } = useMemo(() => {
    const rand = box(42);
    const samples: number[] = [];
    for (let i = 0; i < s.trials; i++) samples.push(s.mean + rand() * s.stdDev);
    samples.sort((a: number, b: number) => a - b);
    const bucket = 14;
    const lo = samples[0]!, hi = samples.at(-1)!;
    const step = (hi - lo) / bucket || 1;
    const counts = new Array(bucket).fill(0) as number[];
    for (const x of samples) {
      const b = Math.min(bucket - 1, Math.floor((x - lo) / step));
      counts[b]!++;
    }
    const at = (q: number) => samples[Math.floor(q * (samples.length - 1))]!;
    const succ = samples.filter((x) => x >= s.successThreshold).length / samples.length;
    return { bins: counts, p10: at(0.1), p50: at(0.5), p90: at(0.9), pSuccess: succ };
  }, [s.mean, s.stdDev, s.trials, s.successThreshold]);

  const max = Math.max(...bins);

  return (
    <Card>
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-rule border-b border-rule">
        {[
          { l: "Mean", v: s.mean, k: "mean" as const },
          { l: "Std dev", v: s.stdDev, k: "stdDev" as const },
          { l: "Trials", v: s.trials, k: "trials" as const, int: true },
          { l: "Success ≥", v: s.successThreshold, k: "successThreshold" as const },
        ].map((f) => (
          <label key={f.k} className="p-3 block">
            <MicroLabel>{f.l}</MicroLabel>
            <input
              type="number"
              value={f.v}
              onChange={(e) => upd({ ...s, [f.k]: f.int ? Math.max(100, Math.min(50000, Math.round(Number(e.target.value) || 100))) : Number(e.target.value) || 0 })}
              data-testid={`mc-${f.k}`}
              className="block w-full mt-1 font-code text-[16px] bg-transparent border-b border-rule outline-none focus:border-vermilion text-ink"
            />
          </label>
        ))}
      </div>
      <div className="p-4">
        <div className="flex items-end gap-1 h-32 border-b border-ink border-l border-ink pl-1" data-testid="mc-histogram">
          {bins.map((b, i) => {
            const isAccent = i >= 2 && i <= 4;
            return (
              <div
                key={i}
                className={`flex-1 ${isAccent ? "bg-vermilion" : "bg-ink"} ${isAccent ? "" : "opacity-80"} border border-ink`}
                style={{ height: `${(b / max) * 100}%` }}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-2 font-code text-[11px] text-ink-muted">
          <span>P10 · {p10.toFixed(0)}</span>
          <span>P50 · {p50.toFixed(0)}</span>
          <span>P90 · {p90.toFixed(0)}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 border-t border-rule">
        <div className="p-4">
          <MicroLabel>P(success)</MicroLabel>
          <div className="font-serif font-medium text-[28px] text-ink mt-1">{(pSuccess * 100).toFixed(1)}%</div>
        </div>
        <div className="p-4 bg-vermilion/5 border-l border-vermilion">
          <MicroLabel accent>P(ruin)</MicroLabel>
          <div className="font-serif font-medium text-[28px] text-vermilion mt-1" data-testid="mc-pruin">
            {((1 - pSuccess) * 100).toFixed(1)}%
          </div>
        </div>
      </div>
    </Card>
  );
}
