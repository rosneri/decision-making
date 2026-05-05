import { z } from "zod";


export const meta = {
  id: "dcf",
  name: "DCF / NPV",
  category: "Financial & investment",
  blurb: "Sum the present value of future cash flows; compare to asking price.",
} as const;

export const schema = z.object({
  framework: z.literal("dcf"),
  category: z.string(),
  title: z.string(),
  unit: z.string(),
  fcf: z.array(z.number()).min(1).max(20),
  terminalValue: z.number(),
  discountRate: z.number().min(0).max(1),
  askingPrice: z.number().min(0),
  recommendation: z.string(),
});
export type Dcf = z.infer<typeof schema>;

export const sample: Dcf = {
  framework: "dcf",
  category: meta.category,
  title: "Is this SaaS company worth $80M?",
  unit: "$M",
  fcf: [12, 14, 17, 19, 21],
  terminalValue: 240,
  discountRate: 0.10,
  askingPrice: 80,
  recommendation: "PV sums to ~$210M against $80M asking — significant margin of safety. Buy if fundamentals hold.",
};
