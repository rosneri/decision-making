import { z } from "zod";


export const meta = {
  id: "pythagorean",
  name: "Pythagorean Expectation",
  category: "Sports analytics",
  blurb: "Expected W% = PF² ÷ (PF² + PA²). Records far above this regress.",
} as const;

export const schema = z.object({
  framework: z.literal("pythagorean"),
  category: z.string(),
  title: z.string(),
  pointsFor: z.number().min(0),
  pointsAgainst: z.number().min(0),
  actualWins: z.number().int().min(0),
  actualLosses: z.number().int().min(0),
  exponent: z.number().min(1).max(5),
  recommendation: z.string(),
});
export type Pythagorean = z.infer<typeof schema>;

export const sample: Pythagorean = {
  framework: "pythagorean",
  category: meta.category,
  title: "Are the team's 12-4 record real, or lucky?",
  pointsFor: 412,
  pointsAgainst: 356,
  actualWins: 12,
  actualLosses: 4,
  exponent: 2,
  recommendation: "Expected ~9.6 wins; actual is 12. They're +2.4 above expectation — expect regression. Don't pay them like a 12-win team.",
};
