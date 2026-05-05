import { z } from "zod";


export const CATS = ["must", "performance", "delighter", "indifferent"] as const;
export type Cat = (typeof CATS)[number];

export const meta = {
  id: "kano",
  name: "Kano Model",
  category: "Product & UX",
  blurb: "Sort features into must-haves, performance, delighters, indifferent.",
} as const;

export const schema = z.object({
  framework: z.literal("kano"),
  category: z.string(),
  title: z.string(),
  features: z.array(z.object({
    name: z.string(),
    category: z.enum(CATS),
  })).min(1).max(20),
  recommendation: z.string(),
});
export type Kano = z.infer<typeof schema>;

export const sample: Kano = {
  framework: "kano",
  category: meta.category,
  title: "Which features actually make customers love us?",
  features: [
    { name: "login works", category: "must" },
    { name: "data exports", category: "must" },
    { name: "faster search", category: "performance" },
    { name: "rich filters", category: "performance" },
    { name: "handwritten welcome card", category: "delighter" },
    { name: "obscure setting toggle", category: "indifferent" },
  ],
  recommendation: "Don't waste a quarter polishing indifferents. Fix the must-haves; budget 20% for one delighter.",
};

export const CAT_META: Record<Cat, { label: string; color: string }> = {
  must: { label: "Must-have", color: "border-ink text-ink" },
  performance: { label: "Performance", color: "border-ink-muted text-ink-muted" },
  delighter: { label: "Delighter", color: "border-vermilion text-vermilion" },
  indifferent: { label: "Indifferent", color: "border-rule text-ink-muted" },
};

export function getMetrics(d: Kano) {
  const must = d.features.filter((f) => f.category === "must").length;
  const perf = d.features.filter((f) => f.category === "performance").length;
  const delight = d.features.filter((f) => f.category === "delighter").length;
  return [
    { k: "Must", v: String(must) },
    { k: "Perf", v: String(perf) },
    { k: "Delight", v: String(delight) },
  ];
}
