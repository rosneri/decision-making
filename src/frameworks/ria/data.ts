import { z } from "zod";


export const meta = {
  id: "ria",
  name: "Regulatory Impact Assessment",
  category: "Public policy",
  blurb: "Sum stakeholder impacts (weighted by power); flag who needs mitigation.",
} as const;

export const schema = z.object({
  framework: z.literal("ria"),
  category: z.string(),
  title: z.string(),
  stakeholders: z.array(z.object({
    name: z.string(),
    netImpact: z.number(),
    power: z.number().int().min(1).max(5),
  })).min(1).max(20),
  recommendation: z.string(),
});
export type Ria = z.infer<typeof schema>;

export const sample: Ria = {
  framework: "ria",
  category: meta.category,
  title: "Will the carbon-pricing rule do net good?",
  stakeholders: [
    { name: "households", netImpact: 120, power: 4 },
    { name: "small biz", netImpact: -45, power: 3 },
    { name: "utilities", netImpact: -210, power: 5 },
    { name: "labor", netImpact: 60, power: 4 },
    { name: "regulators", netImpact: 0, power: 5 },
    { name: "future gen", netImpact: 400, power: 1 },
  ],
  recommendation: "Net benefit is positive (+$325/yr). Mitigate small biz and utilities or the rule won't pass.",
};
