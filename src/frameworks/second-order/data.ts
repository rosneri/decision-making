import { z } from "zod";

export const meta = {
  id: "second_order",
  name: "Second-Order Thinking",
  category: "Mental models",
  blurb: "And then what? Trace the consequence of the consequence — three orders deep.",
} as const;

export const schema = z.object({
  framework: z.literal("second_order"),
  category: z.string(),
  title: z.string(),
  action: z.string(),
  firstOrder: z.array(z.string()).min(1).max(6),
  secondOrder: z.array(z.string()).min(1).max(8),
  thirdOrder: z.array(z.string()).min(0).max(8),
  recommendation: z.string(),
});
export type SecondOrder = z.infer<typeof schema>;

export const sample: SecondOrder = {
  framework: "second_order",
  category: meta.category,
  title: "Cap engineer salaries to control burn?",
  action: "Cap engineering salary band 10% below market",
  firstOrder: ["Save $1.2M/yr in payroll"],
  secondOrder: [
    "Top 20% of engineers leave for market-rate offers",
    "Recruiter NPS drops; pipeline thins",
    "Remaining team takes on more on-call",
  ],
  thirdOrder: [
    "Velocity falls; ship dates slip — revenue drops more than $1.2M",
    "Burnout drives a second wave of attrition",
    "Reputation as cheap employer hardens; future hiring costs +$X/req",
  ],
  recommendation: "First-order savings are real but small relative to compounded second/third-order costs. Don't cap.",
};

export function getMetrics(d: SecondOrder) {
  return [
    { k: "1st", v: String(d.firstOrder.length) },
    { k: "2nd", v: String(d.secondOrder.length) },
    { k: "3rd", v: String(d.thirdOrder.length) },
  ];
}
