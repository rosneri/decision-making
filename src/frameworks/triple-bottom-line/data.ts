import { z } from "zod";

export const PILLARS = ["people", "planet", "profit"] as const;
export type Tbl = (typeof PILLARS)[number];

export const meta = {
  id: "triple_bottom_line",
  name: "Triple Bottom Line",
  category: "Environmental & sustainability",
  blurb: "People · Planet · Profit. A decision wins only if all three accounts net positive.",
} as const;

export const schema = z.object({
  framework: z.literal("triple_bottom_line"),
  category: z.string(),
  title: z.string(),
  initiative: z.string(),
  pillars: z.object({
    people: z.object({ pros: z.array(z.string()).min(1).max(8), cons: z.array(z.string()).min(0).max(8), score: z.number().min(-10).max(10) }),
    planet: z.object({ pros: z.array(z.string()).min(1).max(8), cons: z.array(z.string()).min(0).max(8), score: z.number().min(-10).max(10) }),
    profit: z.object({ pros: z.array(z.string()).min(1).max(8), cons: z.array(z.string()).min(0).max(8), score: z.number().min(-10).max(10) }),
  }),
  recommendation: z.string(),
});
export type TripleBottomLine = z.infer<typeof schema>;

export const sample: TripleBottomLine = {
  framework: "triple_bottom_line",
  category: meta.category,
  title: "Should we move all packaging to refill-only?",
  initiative: "Refill-only packaging program",
  pillars: {
    people: { pros: ["Healthier home product use", "Job creation in refill ops"], cons: ["Less convenient for some customers"], score: 4 },
    planet: { pros: ["~70% less plastic per unit", "Lower transport emissions"], cons: ["Refill-station electricity"], score: 7 },
    profit: { pros: ["Premium pricing power", "Reduced packaging COGS long-term"], cons: ["$3M capex 18-month payback"], score: 2 },
  },
  recommendation: "Net positive on all three pillars; planet score is the standout. Proceed with phased rollout.",
};

export function getMetrics(d: TripleBottomLine) {
  const total = PILLARS.reduce((n, p) => n + d.pillars[p].score, 0);
  const fails = PILLARS.filter((p) => d.pillars[p].score < 0);
  return [
    { k: "Net", v: total >= 0 ? `+${total}` : String(total) },
    { k: "Verdict", v: fails.length === 0 ? "all positive" : `${fails.length} negative` },
  ];
}
