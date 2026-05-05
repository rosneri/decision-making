import { z } from "zod";


export const meta = {
  id: "scorecard",
  name: "Scorecard Method",
  category: "Hiring & talent",
  blurb: "Define mission, outcomes, competencies BEFORE meeting candidates. Score each against the card.",
} as const;

export const schema = z.object({
  framework: z.literal("scorecard"),
  category: z.string(),
  title: z.string(),
  mission: z.string(),
  outcomes: z.array(z.string()).min(1).max(8),
  competencies: z.array(z.string()).min(1).max(12),
  recommendation: z.string(),
});
export type Scorecard = z.infer<typeof schema>;

export const sample: Scorecard = {
  framework: "scorecard",
  category: meta.category,
  title: "What would 'great' actually look like in this role?",
  mission: "Grow MRR from $2M to $5M without raising CAC.",
  outcomes: [
    "Ship pricing-page rebuild · +18% conversion",
    "Launch self-serve · 200 paid teams",
    "Cut churn from 4% → 2.5%",
  ],
  competencies: ["analytical", "fast-execute", "writes well", "calm under load", "cross-functional"],
  recommendation: "Score every candidate against THIS card, not against each other. Reject anyone weak on > 2 competencies.",
};
