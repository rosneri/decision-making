import { z } from "zod";

export const meta = {
  id: "ab_testing",
  name: "A/B Testing",
  category: "Data & ML",
  blurb: "Randomize, measure the lift, decide if it crossed the significance bar.",
} as const;

export const schema = z.object({
  framework: z.literal("ab_testing"),
  category: z.string(),
  title: z.string(),
  hypothesis: z.string(),
  metric: z.string(),
  control: z.object({
    n: z.number().int().min(1),
    conversions: z.number().int().min(0),
  }),
  treatment: z.object({
    n: z.number().int().min(1),
    conversions: z.number().int().min(0),
  }),
  alpha: z.number().min(0.001).max(0.5),
  recommendation: z.string(),
});
export type AbTesting = z.infer<typeof schema>;

export const sample: AbTesting = {
  framework: "ab_testing",
  category: meta.category,
  title: "Does the new pricing page convert better?",
  hypothesis: "Three-tier layout will lift purchase conversion vs. single-CTA",
  metric: "purchase rate",
  control: { n: 8400, conversions: 168 },
  treatment: { n: 8500, conversions: 221 },
  alpha: 0.05,
  recommendation: "Lift = +30% relative; z ≈ 2.7, p ≈ 0.007 — significant at α=0.05. Ship the treatment.",
};

function normalCdf(z: number): number {
  // Abramowitz & Stegun 7.1.26 approximation of erf
  const sign = z < 0 ? -1 : 1;
  const x = Math.abs(z) / Math.SQRT2;
  const t = 1 / (1 + 0.3275911 * x);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return 0.5 * (1 + sign * y);
}

export function stats(d: AbTesting) {
  const pC = d.control.conversions / d.control.n;
  const pT = d.treatment.conversions / d.treatment.n;
  const lift = pC === 0 ? 0 : (pT - pC) / pC;
  const pPool = (d.control.conversions + d.treatment.conversions) / (d.control.n + d.treatment.n);
  const se = Math.sqrt(pPool * (1 - pPool) * (1 / d.control.n + 1 / d.treatment.n));
  const z = se === 0 ? 0 : (pT - pC) / se;
  const p = 2 * (1 - normalCdf(Math.abs(z)));
  return { pC, pT, lift, z, p, significant: p < d.alpha };
}

export function getMetrics(d: AbTesting) {
  const { lift, p, significant } = stats(d);
  return [
    { k: "Lift", v: `${(lift * 100).toFixed(1)}%` },
    { k: "p-value", v: p.toFixed(3) },
    { k: "Verdict", v: significant ? "ship" : "hold" },
  ];
}
