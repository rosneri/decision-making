import { z } from "zod";


export const meta = {
  id: "lca",
  name: "Life-Cycle Assessment",
  category: "Environmental & sustainability",
  blurb: "Track impact across cradle-to-grave; the largest stage is your hotspot.",
} as const;

export const schema = z.object({
  framework: z.literal("lca"),
  category: z.string(),
  title: z.string(),
  unit: z.string(),
  stages: z.array(z.object({
    name: z.string(),
    impact: z.number().min(0),
  })).min(2).max(12),
  recommendation: z.string(),
});
export type Lca = z.infer<typeof schema>;

export const sample: Lca = {
  framework: "lca",
  category: meta.category,
  title: "How sustainable is the new packaging really?",
  unit: "kg CO₂e",
  stages: [
    { name: "raw materials", impact: 38 },
    { name: "manufacture", impact: 22 },
    { name: "transport", impact: 8 },
    { name: "use", impact: 18 },
    { name: "end of life", impact: 14 },
  ],
  recommendation: "Hotspot is raw materials at 38%. Switch sourcing first — manufacturing tweaks won't move the needle.",
};
