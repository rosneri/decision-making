import { z } from "zod";


export const QUAL = ["very_low", "low", "moderate", "high"] as const;
export type Qual = (typeof QUAL)[number];

export const meta = {
  id: "grade",
  name: "GRADE Framework",
  category: "Medical & clinical",
  blurb: "Grade evidence quality, then decide strength of recommendation.",
} as const;

export const schema = z.object({
  framework: z.literal("grade"),
  category: z.string(),
  title: z.string(),
  studies: z.array(z.object({
    type: z.string(),
    n: z.number().int().min(0).optional(),
    quality: z.enum(QUAL),
  })).min(1).max(20),
  strength: z.enum(["strong", "conditional"]),
  recommendation: z.string(),
});
export type Grade = z.infer<typeof schema>;

export const sample: Grade = {
  framework: "grade",
  category: meta.category,
  title: "Recommend statin for low-risk 50yo?",
  studies: [
    { type: "RCT × 3", n: 4200, quality: "high" },
    { type: "Cohort × 2", n: 1800, quality: "moderate" },
    { type: "Case-ctrl", n: 240, quality: "low" },
    { type: "Expert opin", quality: "very_low" },
  ],
  strength: "conditional",
  recommendation: "Discuss; don't default. High-quality RCTs exist but absolute benefit is modest at low baseline risk.",
};

export const QUAL_META: Record<Qual, { label: string; level: number }> = {
  very_low: { label: "Very low", level: 1 },
  low: { label: "Low", level: 2 },
  moderate: { label: "Moderate", level: 3 },
  high: { label: "High", level: 4 },
};
