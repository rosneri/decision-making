import { z } from "zod";

export const PILLARS = ["love", "good", "paidFor", "needs"] as const;
export type Pillar = (typeof PILLARS)[number];

export const meta = {
  id: "ikigai",
  name: "Ikigai",
  category: "Career & life design",
  blurb: "Where what you love · what you're good at · what pays · what the world needs intersect.",
} as const;

export const schema = z.object({
  framework: z.literal("ikigai"),
  category: z.string(),
  title: z.string(),
  love: z.array(z.string()).min(1).max(8),
  good: z.array(z.string()).min(1).max(8),
  paidFor: z.array(z.string()).min(1).max(8),
  needs: z.array(z.string()).min(1).max(8),
  ikigai: z.string(),
  recommendation: z.string(),
});
export type Ikigai = z.infer<typeof schema>;

export const sample: Ikigai = {
  framework: "ikigai",
  category: meta.category,
  title: "What should I build a career around?",
  love: ["explaining hard ideas", "writing", "live teaching"],
  good: ["distilling research", "lecturing", "Python"],
  paidFor: ["corporate training", "online courses", "books"],
  needs: ["AI literacy at work", "data fluency"],
  ikigai: "Practical AI training for non-technical professionals",
  recommendation: "All four overlap on 'practical AI training for working professionals' — that's the wedge.",
};

export const META: Record<Pillar, { label: string; q: string }> = {
  love: { label: "What you LOVE", q: "passion" },
  good: { label: "What you're GOOD at", q: "skill" },
  paidFor: { label: "What you can be PAID for", q: "profession" },
  needs: { label: "What the world NEEDS", q: "mission" },
};

export function getMetrics(d: Ikigai) {
  return [
    { k: "Ikigai", v: d.ikigai || "—" },
    { k: "Inputs", v: String(d.love.length + d.good.length + d.paidFor.length + d.needs.length) },
  ];
}
