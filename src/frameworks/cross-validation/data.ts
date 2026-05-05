import { z } from "zod";


export const meta = {
  id: "cross_validation",
  name: "Cross-Validation",
  category: "Data & ML",
  blurb: "Pick the model with high accuracy AND low variance across folds.",
} as const;

export const schema = z.object({
  framework: z.literal("cross_validation"),
  category: z.string(),
  title: z.string(),
  models: z.array(z.object({
    name: z.string(),
    foldScores: z.array(z.number().min(0).max(1)).min(2).max(20),
  })).min(1).max(10),
  recommendation: z.string(),
});
export type CrossValidation = z.infer<typeof schema>;

export const sample: CrossValidation = {
  framework: "cross_validation",
  category: meta.category,
  title: "Pick the model that won't overfit.",
  models: [
    { name: "logistic", foldScores: [0.80, 0.81, 0.83, 0.79, 0.82] },
    { name: "rf · 200 trees", foldScores: [0.85, 0.87, 0.86, 0.84, 0.88] },
    { name: "xgboost", foldScores: [0.82, 0.88, 0.85, 0.83, 0.87] },
    { name: "transformer", foldScores: [0.74, 0.92, 0.78, 0.90, 0.86] },
  ],
  recommendation: "Random forest wins: high mean, lowest variance across folds. Transformer's spread suggests overfitting.",
};

export const stats = (xs: number[]) => {
  const m = xs.reduce((a, b) => a + b, 0) / xs.length;
  const v = xs.reduce((a, b) => a + (b - m) ** 2, 0) / xs.length;
  return { mean: m, std: Math.sqrt(v) };
};

export function getMetrics(d: CrossValidation) {
  const scored = d.models.map((m) => ({ name: m.name, ...stats(m.foldScores) }));
  const best = scored.reduce((b, m) => (m.mean - m.std > b.mean - b.std ? m : b), scored[0]!);
  return [
    { k: "Pick", v: best.name },
    { k: "Mean", v: best.mean.toFixed(3) },
    { k: "Std", v: best.std.toFixed(3) },
  ];
}
