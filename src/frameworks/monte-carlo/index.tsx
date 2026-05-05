"use client";
import { useMemo, useState } from "react";
import { z } from "zod";

export const meta = {
  id: "monte_carlo",
  name: "Monte Carlo Simulation",
  category: "Risk & forecasting",
  blurb: "Run thousands of trials to see the distribution, not just one estimate.",
} as const;

export const schema = z.object({
  framework: z.literal("monte_carlo"),
  category: z.string(),
  title: z.string(),
  unit: z.string(),
  mean: z.number(),
  stdDev: z.number().min(0),
  trials: z.number().int().min(100).max(50000),
  successThreshold: z.number(),
  recommendation: z.string(),
});
export type MonteCarlo = z.infer<typeof schema>;

export const sample: MonteCarlo = {
  framework: "monte_carlo",
  category: meta.category,
  title: "Will the retirement plan run out before 90?",
  unit: "$",
  mean: 1200000,
  stdDev: 500000,
  trials: 10000,
  successThreshold: 800000,
  recommendation: "P(ruin) is around 28% at this savings rate. Increase contributions or shift the threshold before retiring.",
};

function box(seed: number) {
  let x = seed | 0;
  return () => {
    x = (x * 1664525 + 1013904223) | 0;
    const u = ((x >>> 0) / 4294967296) || 1e-9;
    x = (x * 1664525 + 1013904223) | 0;
    const v = ((x >>> 0) / 4294967296) || 1e-9;
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
}

export function View({ data, onUpdate }: { data: MonteCarlo; onUpdate?: (d: MonteCarlo) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: MonteCarlo) => { setS(n); onUpdate?.(n); };

  const { bins, p10, p50, p90, pSuccess } = useMemo(() => {
    const rand = box(42);
    const samples: number[] = [];
    for (let i = 0; i < s.trials; i++) samples.push(s.mean + rand() * s.stdDev);
    samples.sort((a, b) => a - b);
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
    <div className="border border-ink bg-paper">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-rule border-b border-rule">
        {[
          { l: "Mean", v: s.mean, k: "mean" as const },
          { l: "Std dev", v: s.stdDev, k: "stdDev" as const },
          { l: "Trials", v: s.trials, k: "trials" as const, int: true },
          { l: "Success ≥", v: s.successThreshold, k: "successThreshold" as const },
        ].map((f) => (
          <label key={f.k} className="p-3 block">
            <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">{f.l}</span>
            <input type="number" value={f.v}
              onChange={(e) => upd({ ...s, [f.k]: f.int ? Math.max(100, Math.min(50000, Math.round(Number(e.target.value) || 100))) : Number(e.target.value) || 0 })}
              data-testid={`mc-${f.k}`}
              className="block w-full mt-1 font-code text-[16px] bg-transparent border-b border-rule outline-none focus:border-vermilion text-ink" />
          </label>
        ))}
      </div>
      <div className="p-4">
        <div className="flex items-end gap-1 h-32 border-b border-ink border-l border-ink pl-1" data-testid="mc-histogram">
          {bins.map((b, i) => {
            const isAccent = i >= 2 && i <= 4;
            return (
              <div key={i} className={`flex-1 ${isAccent ? "bg-vermilion" : "bg-ink"} ${isAccent ? "" : "opacity-80"} border border-ink`}
                style={{ height: `${(b / max) * 100}%` }} />
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
          <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">P(success)</span>
          <div className="font-serif font-medium text-[28px] text-ink mt-1">{(pSuccess * 100).toFixed(1)}%</div>
        </div>
        <div className="p-4 bg-vermilion/5 border-l border-vermilion">
          <span className="font-code text-[10px] tracking-[0.22em] uppercase text-vermilion">P(ruin)</span>
          <div className="font-serif font-medium text-[28px] text-vermilion mt-1" data-testid="mc-pruin">
            {((1 - pSuccess) * 100).toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
}
