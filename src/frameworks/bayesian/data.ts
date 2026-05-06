import { z } from "zod";

export const meta = {
  id: "bayesian",
  name: "Bayesian Update",
  category: "Risk & forecasting",
  blurb: "Update your belief by the strength of the evidence — Bayes' rule, the right way.",
} as const;

export const schema = z.object({
  framework: z.literal("bayesian"),
  category: z.string(),
  title: z.string(),
  hypothesis: z.string(),
  prior: z.number().min(0.0001).max(0.9999),
  evidence: z.array(z.object({
    name: z.string(),
    pIfTrue: z.number().min(0.0001).max(0.9999),   // P(evidence | H)
    pIfFalse: z.number().min(0.0001).max(0.9999),  // P(evidence | ¬H)
    observed: z.boolean(),
  })).min(1).max(8),
  recommendation: z.string(),
});
export type Bayesian = z.infer<typeof schema>;

export const sample: Bayesian = {
  framework: "bayesian",
  category: meta.category,
  title: "Is the candidate going to be a top performer?",
  hypothesis: "Candidate becomes a top-quartile hire",
  prior: 0.25,
  evidence: [
    { name: "Aced the work-sample test", pIfTrue: 0.85, pIfFalse: 0.30, observed: true },
    { name: "Strong reference from past manager", pIfTrue: 0.70, pIfFalse: 0.40, observed: true },
    { name: "Job-hopped 3× in 4 years", pIfTrue: 0.20, pIfFalse: 0.45, observed: true },
    { name: "Built a side project in our domain", pIfTrue: 0.40, pIfFalse: 0.10, observed: false },
  ],
  recommendation: "Posterior moves from 25% prior to ~52% — credible-but-not-yes. Consider a paid trial week to gather more evidence.",
};

export function update(d: Bayesian) {
  let p = d.prior;
  const trail: number[] = [p];
  for (const e of d.evidence) {
    if (!e.observed) { trail.push(p); continue; }
    const num = e.pIfTrue * p;
    const den = num + e.pIfFalse * (1 - p);
    p = den === 0 ? p : num / den;
    trail.push(p);
  }
  return { posterior: p, trail };
}

export function getMetrics(d: Bayesian) {
  const { posterior } = update(d);
  return [
    { k: "Prior", v: `${(d.prior * 100).toFixed(0)}%` },
    { k: "Posterior", v: `${(posterior * 100).toFixed(0)}%` },
  ];
}
