import { z } from "zod";


export const meta = {
  id: "wardley",
  name: "Wardley Mapping",
  category: "Strategy & business",
  blurb: "Plot value-chain components by visibility (y) and evolution (x). Bet on what's evolving.",
} as const;

export const schema = z.object({
  framework: z.literal("wardley"),
  category: z.string(),
  title: z.string(),
  nodes: z.array(z.object({
    name: z.string(),
    visibility: z.number().min(0).max(100),
    evolution: z.number().min(0).max(100),
    invest: z.boolean().optional(),
  })).min(1).max(20),
  recommendation: z.string(),
});
export type Wardley = z.infer<typeof schema>;

export const sample: Wardley = {
  framework: "wardley",
  category: meta.category,
  title: "Where should we invest engineering effort this year?",
  nodes: [
    { name: "user", visibility: 92, evolution: 88 },
    { name: "checkout", visibility: 75, evolution: 70 },
    { name: "payment SDK", visibility: 55, evolution: 50 },
    { name: "fraud ML", visibility: 35, evolution: 30 },
    { name: "data lake", visibility: 18, evolution: 14 },
    { name: "promo engine", visibility: 50, evolution: 78, invest: true },
  ],
  recommendation: "Promo engine sits in the productized zone — invest there. Don't reinvent fraud or storage; use commodities.",
};

export const STAGES = ["Genesis", "Custom", "Product", "Commodity"];
