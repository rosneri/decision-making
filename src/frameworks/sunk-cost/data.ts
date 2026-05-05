import { z } from "zod";


export const meta = {
  id: "sunk_cost",
  name: "Sunk Cost Avoidance",
  category: "Personal finance",
  blurb: "Past spend is gone. Decide forward — never backward.",
} as const;

export const schema = z.object({
  framework: z.literal("sunk_cost"),
  category: z.string(),
  title: z.string(),
  sunk: z.object({ description: z.string(), value: z.string() }),
  options: z.array(z.object({
    name: z.string(),
    forwardCost: z.string(),
    forwardBenefit: z.string(),
    expectedValue: z.number(),
  })).min(2).max(6),
  recommendation: z.string(),
});
export type SunkCost = z.infer<typeof schema>;

export const sample: SunkCost = {
  framework: "sunk_cost",
  category: meta.category,
  title: "I've spent 2 years on this PhD. Quit?",
  sunk: { description: "PhD years", value: "$140k · 2 yrs" },
  options: [
    { name: "Finish", forwardCost: "+$80k cost · +3 yrs", forwardBenefit: "PhD title · soft job market", expectedValue: 30 },
    { name: "Quit", forwardCost: "0", forwardBenefit: "industry job · $140k/yr starting", expectedValue: 90 },
  ],
  recommendation: "Sunk is sunk. Forward expected value strongly favors quitting. Decide forward, not backward.",
};

export function getMetrics(d: SunkCost) {
  const top = d.options.reduce((b, o) => (o.expectedValue > b.expectedValue ? o : b), d.options[0]!);
  return [
    { k: "Forward pick", v: top.name },
    { k: "EV", v: top.expectedValue.toFixed(0) },
  ];
}
