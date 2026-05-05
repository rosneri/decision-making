import { z } from "zod";


export const meta = {
  id: "algo_impact",
  name: "Algorithmic Impact",
  category: "AI alignment",
  blurb: "Score risk dimensions; one open high-severity item blocks shipping.",
} as const;

export const schema = z.object({
  framework: z.literal("algo_impact"),
  category: z.string(),
  title: z.string(),
  risks: z.array(z.object({
    dimension: z.string(),
    severity: z.number().int().min(1).max(5),
    open: z.boolean(),
  })).min(1).max(20),
  recommendation: z.string(),
});
export type AlgoImpact = z.infer<typeof schema>;

export const sample: AlgoImpact = {
  framework: "algo_impact",
  category: meta.category,
  title: "Should we ship the resume-screener model?",
  risks: [
    { dimension: "Disparate impact · gender", severity: 4, open: true },
    { dimension: "Disparate impact · race", severity: 5, open: true },
    { dimension: "Privacy · résumé content", severity: 2, open: false },
    { dimension: "Explainability to candidate", severity: 4, open: true },
    { dimension: "Recourse / appeal path", severity: 3, open: false },
    { dimension: "Model drift over 12mo", severity: 3, open: false },
  ],
  recommendation: "Two open items at severity 4+. Do not ship. Run bias mitigation pass + add explainability before re-evaluation.",
};

export function getMetrics(d: AlgoImpact) {
  const openHigh = d.risks.filter((r) => r.open && r.severity >= 4).length;
  const max = d.risks.reduce((m, r) => Math.max(m, r.severity), 0);
  return [
    { k: "Open ≥4", v: String(openHigh) },
    { k: "Verdict", v: openHigh > 0 ? "Block" : "Ship" },
    { k: "Max severity", v: String(max) },
  ];
}
