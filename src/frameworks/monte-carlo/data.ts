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

export function box(seed: number) {
  let x = seed | 0;
  return () => {
    x = (x * 1664525 + 1013904223) | 0;
    const u = ((x >>> 0) / 4294967296) || 1e-9;
    x = (x * 1664525 + 1013904223) | 0;
    const v = ((x >>> 0) / 4294967296) || 1e-9;
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
}

export function getMetrics(d: MonteCarlo) {
  let success = 0;
  const rng = box(42);
  for (let i = 0; i < d.trials; i++) {
    const x = d.mean + d.stdDev * rng();
    if (x >= d.successThreshold) success++;
  }
  return [
    { k: "P(success)", v: `${((success / d.trials) * 100).toFixed(1)}%` },
    { k: "Trials", v: String(d.trials) },
  ];
}
