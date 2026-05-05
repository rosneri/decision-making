import { z } from "zod";


export const meta = {
  id: "qaly",
  name: "Cost-Effectiveness · QALY",
  category: "Public policy",
  blurb: "Rank interventions by $ per quality-adjusted life year. Fund what's below the WTP threshold.",
} as const;

export const schema = z.object({
  framework: z.literal("qaly"),
  category: z.string(),
  title: z.string(),
  wtpPerQaly: z.number().min(0),
  interventions: z.array(z.object({
    name: z.string(),
    cost: z.number().min(0),
    qalyGained: z.number().min(0),
  })).min(1).max(20),
  recommendation: z.string(),
});
export type Qaly = z.infer<typeof schema>;

export const sample: Qaly = {
  framework: "qaly",
  category: meta.category,
  title: "Where should the next $10M of health budget go?",
  wtpPerQaly: 50000,
  interventions: [
    { name: "vaccinate kids · measles", cost: 12, qalyGained: 4.2 },
    { name: "smoking cessation program", cost: 1100, qalyGained: 2.1 },
    { name: "diabetes screening", cost: 4500, qalyGained: 1.8 },
    { name: "MRI for back pain", cost: 18000, qalyGained: 0.3 },
  ],
  recommendation: "Fund: vaccination, cessation, screening (all <$50k/QALY). Skip MRI for non-specific back pain.",
};

export function getMetrics(d: Qaly) {
  const ratios = d.interventions.map((i) => ({ name: i.name, ratio: i.cost / (i.qalyGained || 1e-9) }));
  const fund = ratios.filter((r) => r.ratio <= d.wtpPerQaly).length;
  return [
    { k: "WTP", v: `$${d.wtpPerQaly.toLocaleString()}` },
    { k: "Fund", v: `${fund}/${d.interventions.length}` },
  ];
}
