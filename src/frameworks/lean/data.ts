import { z } from "zod";


export const meta = {
  id: "lean",
  name: "Build-Measure-Learn",
  category: "Innovation & creativity",
  blurb: "Tight loops: ship the smallest test, measure the right metric, decide pivot vs persevere.",
} as const;

export const schema = z.object({
  framework: z.literal("lean"),
  category: z.string(),
  title: z.string(),
  cycle: z.number().int().min(1),
  hypothesis: z.string(),
  build: z.string(),
  measure: z.object({ metric: z.string(), value: z.number() }),
  learn: z.string(),
  decision: z.enum(["persevere", "pivot", "kill"]),
  recommendation: z.string(),
});
export type Lean = z.infer<typeof schema>;

export const sample: Lean = {
  framework: "lean",
  category: meta.category,
  title: "Should we keep building, or pivot?",
  cycle: 4,
  hypothesis: "freelancers will pay $20/mo for invoice automation",
  build: "v0.3 MVP — Stripe + 3 templates",
  measure: { metric: "paid signups", value: 42 },
  learn: "freelancers love it; agencies asked for team accounts",
  decision: "pivot",
  recommendation: "Pivot the segment to small agencies; persevere on the offer. Run cycle 5 with team-account billing.",
};
