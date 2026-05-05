import { z } from "zod";


export const meta = {
  id: "doughnut",
  name: "Doughnut Economics",
  category: "Environmental & sustainability",
  blurb: "Stay between the social floor and the ecological ceiling.",
} as const;

export const schema = z.object({
  framework: z.literal("doughnut"),
  category: z.string(),
  title: z.string(),
  shortfalls: z.array(z.object({ name: z.string(), severity: z.number().int().min(0).max(5) })).min(0).max(20),
  overshoots: z.array(z.object({ name: z.string(), severity: z.number().int().min(0).max(5) })).min(0).max(20),
  recommendation: z.string(),
});
export type Doughnut = z.infer<typeof schema>;

export const sample: Doughnut = {
  framework: "doughnut",
  category: meta.category,
  title: "Is our city's growth plan within bounds?",
  shortfalls: [
    { name: "housing", severity: 4 },
    { name: "income", severity: 3 },
    { name: "health", severity: 2 },
  ],
  overshoots: [
    { name: "CO₂", severity: 5 },
    { name: "land use", severity: 3 },
    { name: "freshwater", severity: 4 },
  ],
  recommendation: "Plan overshoots ecological ceiling on CO₂ and freshwater. Add carbon-budget cap and water reuse before approval.",
};

export type Side = "shortfalls" | "overshoots";

export function getMetrics(d: Doughnut) {
  const breaches = [...d.shortfalls, ...d.overshoots].filter((x) => x.severity >= 3).length;
  const total = d.shortfalls.length + d.overshoots.length;
  return [
    { k: "Breaches ≥3", v: `${breaches}/${total}` },
    { k: "Verdict", v: breaches === 0 ? "In bounds" : "Out of bounds" },
  ];
}
