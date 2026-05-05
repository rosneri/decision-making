import { z } from "zod";


export const meta = {
  id: "cost_sensitive",
  name: "Cost-Sensitive Threshold",
  category: "Data & ML",
  blurb: "Set the threshold to maximize $ — not accuracy. Asymmetric error costs change the answer.",
} as const;

export const schema = z.object({
  framework: z.literal("cost_sensitive"),
  category: z.string(),
  title: z.string(),
  payoffs: z.object({
    truePos: z.number(),
    falsePos: z.number(),
    falseNeg: z.number(),
    trueNeg: z.number(),
  }),
  baseRate: z.number().min(0).max(1),
  threshold: z.number().min(0).max(1),
  recommendation: z.string(),
});
export type CostSensitive = z.infer<typeof schema>;

export const sample: CostSensitive = {
  framework: "cost_sensitive",
  category: meta.category,
  title: "Where do we set the fraud-flag threshold?",
  payoffs: { truePos: 100, falsePos: -2, falseNeg: -500, trueNeg: 0 },
  baseRate: 0.05,
  threshold: 0.32,
  recommendation: "False negatives cost ~250× a false positive — flag aggressively. Threshold ≈ 0.32 maximizes $.",
};
