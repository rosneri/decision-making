import { z } from "zod";

export const meta = {
  id: "four_percent",
  name: "4% Rule (FIRE)",
  category: "Personal finance",
  blurb: "Spend ≤ 4% of your nest egg per year and history says it lasts 30 years.",
} as const;

export const schema = z.object({
  framework: z.literal("four_percent"),
  category: z.string(),
  title: z.string(),
  annualSpend: z.number().min(0),
  withdrawalRate: z.number().min(0.01).max(0.10),
  currentSavings: z.number().min(0),
  monthlyContribution: z.number().min(0),
  expectedReturn: z.number().min(0).max(0.20),
  recommendation: z.string(),
});
export type FourPercent = z.infer<typeof schema>;

export const sample: FourPercent = {
  framework: "four_percent",
  category: meta.category,
  title: "When can I retire?",
  annualSpend: 60_000,
  withdrawalRate: 0.04,
  currentSavings: 320_000,
  monthlyContribution: 2_500,
  expectedReturn: 0.07,
  recommendation: "Target FIRE number is $1.5M; on the current trajectory, ~17 years away. Cut spending or raise contributions to accelerate.",
};

export function fireMath(d: FourPercent) {
  const target = d.annualSpend / d.withdrawalRate;
  const r = d.expectedReturn / 12;
  const FV = d.currentSavings;
  const M = d.monthlyContribution;
  // Solve for n (months) in: target = FV*(1+r)^n + M*((1+r)^n - 1)/r
  // (FV*r + M)*(1+r)^n = target*r + M  =>  n = log((target*r + M) / (FV*r + M)) / log(1+r)
  let years = 0;
  if (r > 0 && (FV * r + M) > 0) {
    const num = target * r + M;
    const den = FV * r + M;
    if (num > 0 && den > 0 && num >= den) {
      const n = Math.log(num / den) / Math.log(1 + r);
      years = n / 12;
    }
  } else if (M > 0) {
    years = (target - FV) / (M * 12);
  }
  return { target, years: Math.max(0, years) };
}

export function getMetrics(d: FourPercent) {
  const { target, years } = fireMath(d);
  return [
    { k: "Target", v: `$${Math.round(target).toLocaleString()}` },
    { k: "Years", v: years.toFixed(1) },
  ];
}
