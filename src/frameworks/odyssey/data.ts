import { z } from "zod";


export const meta = {
  id: "odyssey",
  name: "Odyssey Plans",
  category: "Career & life design",
  blurb: "Sketch three radically different five-year plans, then prototype the most magnetic.",
} as const;

export const schema = z.object({
  framework: z.literal("odyssey"),
  category: z.string(),
  title: z.string(),
  plans: z.array(z.object({
    title: z.string(),
    note: z.string(),
    trajectory: z.array(z.number().min(0).max(10)).min(2).max(12),
    resources: z.number().int().min(1).max(5),
    likeability: z.number().int().min(1).max(5),
    confidence: z.number().int().min(1).max(5),
  })).min(2).max(5),
  preferred: z.number().int().min(0).max(2),
  recommendation: z.string(),
});
export type Odyssey = z.infer<typeof schema>;

export const sample: Odyssey = {
  framework: "odyssey",
  category: meta.category,
  title: "What should the next five years look like?",
  plans: [
    { title: "Plan A · the path I'm on", note: "promoted to staff", trajectory: [3, 4, 4, 5, 4, 5], resources: 4, likeability: 3, confidence: 4 },
    { title: "Plan B · a real alternative", note: "found a startup", trajectory: [3, 3, 5, 5, 6, 6], resources: 2, likeability: 5, confidence: 3 },
    { title: "Plan C · what if money/status didn't matter?", note: "teach + write", trajectory: [3, 4, 4, 4, 5, 6], resources: 3, likeability: 4, confidence: 3 },
  ],
  preferred: 1,
  recommendation: "Plan B has the steepest likeability gradient. Talk to 3 people doing it before committing.",
};

export function getMetrics(d: Odyssey) {
  return [
    { k: "Preferred", v: d.plans[d.preferred]?.title ?? "—" },
  ];
}
