import { z } from "zod";

export const meta = {
  id: "mpt",
  name: "Modern Portfolio Theory",
  category: "Financial & investment",
  blurb: "Maximize return for a given variance. Diversification is the only free lunch.",
} as const;

export const schema = z.object({
  framework: z.literal("mpt"),
  category: z.string(),
  title: z.string(),
  riskFreeRate: z.number().min(0).max(0.2),
  assets: z.array(z.object({
    name: z.string(),
    weight: z.number().min(0).max(1),
    expectedReturn: z.number(),
    volatility: z.number().min(0),
  })).min(2).max(8),
  recommendation: z.string(),
});
export type Mpt = z.infer<typeof schema>;

export const sample: Mpt = {
  framework: "mpt",
  category: meta.category,
  title: "Allocate $1M across asset classes",
  riskFreeRate: 0.04,
  assets: [
    { name: "US Equities", weight: 0.5, expectedReturn: 0.09, volatility: 0.18 },
    { name: "Bonds (10y Treasury)", weight: 0.3, expectedReturn: 0.045, volatility: 0.06 },
    { name: "Intl Equities", weight: 0.15, expectedReturn: 0.08, volatility: 0.20 },
    { name: "REITs", weight: 0.05, expectedReturn: 0.07, volatility: 0.22 },
  ],
  recommendation: "Sharpe ≈ 0.4 at the chosen weights — solid for a balanced 60/40-ish portfolio. Consider trimming REITs.",
};

export function portfolio(d: Mpt) {
  const totalW = d.assets.reduce((n, a) => n + a.weight, 0) || 1;
  const expected = d.assets.reduce((n, a) => n + (a.weight / totalW) * a.expectedReturn, 0);
  // Approximation: assume zero cross-correlation (worst case = sum of variances).
  const variance = d.assets.reduce((n, a) => n + Math.pow((a.weight / totalW) * a.volatility, 2), 0);
  const stdev = Math.sqrt(variance);
  const sharpe = stdev === 0 ? 0 : (expected - d.riskFreeRate) / stdev;
  return { expected, stdev, sharpe, totalW };
}

export function getMetrics(d: Mpt) {
  const p = portfolio(d);
  return [
    { k: "Expected", v: `${(p.expected * 100).toFixed(1)}%` },
    { k: "σ", v: `${(p.stdev * 100).toFixed(1)}%` },
    { k: "Sharpe", v: p.sharpe.toFixed(2) },
  ];
}
