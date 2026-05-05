import { z } from "zod";


export const meta = {
  id: "reference_class",
  name: "Reference Class Forecasting",
  category: "Risk & forecasting",
  blurb: "Stop estimating from inside the project. Anchor on the actual base rate of similar past ones.",
} as const;

export const schema = z.object({
  framework: z.literal("reference_class"),
  category: z.string(),
  title: z.string(),
  unit: z.string(),
  yourEstimate: z.number().min(0),
  pastProjects: z.array(z.object({
    name: z.string(),
    estimate: z.number().min(0),
    actual: z.number().min(0),
  })).min(1).max(20),
  recommendation: z.string(),
});
export type ReferenceClass = z.infer<typeof schema>;

export const sample: ReferenceClass = {
  framework: "reference_class",
  category: meta.category,
  title: "Will this software project really ship in 12 months?",
  unit: "months",
  yourEstimate: 12,
  pastProjects: [
    { name: "Project A", estimate: 10, actual: 18 },
    { name: "Project B", estimate: 14, actual: 22 },
    { name: "Project C", estimate: 9, actual: 16 },
    { name: "Project D", estimate: 12, actual: 24 },
    { name: "Project E", estimate: 16, actual: 28 },
  ],
  recommendation: "Past base rate is ~1.75× over plan. Your 12-month estimate likely lands at 20–22 months. Plan funding accordingly.",
};
