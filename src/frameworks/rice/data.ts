import { z } from "zod";


export const meta = {
  id: "rice",
  name: "RICE Scoring",
  category: "Speed & prioritization",
  blurb: "Reach × Impact × Confidence ÷ Effort. Rank features by what's truly worth shipping.",
} as const;

export const schema = z.object({
  framework: z.literal("rice"),
  category: z.string(),
  title: z.string(),
  items: z.array(z.object({
    feature: z.string(),
    reach: z.number().min(0),
    impact: z.number().min(0).max(5),
    confidence: z.number().min(0).max(1),
    effort: z.number().min(0.1),
  })).min(1).max(12),
  recommendation: z.string(),
});
export type Rice = z.infer<typeof schema>;

export const sample: Rice = {
  framework: "rice",
  category: meta.category,
  title: "Which feature should ship next quarter?",
  items: [
    { feature: "Onboarding revamp", reach: 8000, impact: 3, confidence: 0.8, effort: 4 },
    { feature: "Mobile push", reach: 12000, impact: 1, confidence: 0.9, effort: 2 },
    { feature: "Search v2", reach: 5000, impact: 2, confidence: 0.5, effort: 6 },
    { feature: "Referral loop", reach: 9000, impact: 2, confidence: 0.7, effort: 3 },
  ],
  recommendation: "Ship Mobile push first — highest score with lowest effort. Onboarding revamp is the next bet.",
};

export const score = (x: Rice["items"][number]) => (x.reach * x.impact * x.confidence) / x.effort;
