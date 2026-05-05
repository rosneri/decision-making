import { z } from "zod";


export const meta = {
  id: "stoic",
  name: "Dichotomy of Control",
  category: "Spiritual & philosophical",
  blurb: "Yours · not yours. Act on the first; release the second.",
} as const;

export const schema = z.object({
  framework: z.literal("stoic"),
  category: z.string(),
  title: z.string(),
  yours: z.array(z.string()).min(0).max(20),
  notYours: z.array(z.string()).min(0).max(20),
  recommendation: z.string(),
});
export type Stoic = z.infer<typeof schema>;

export const sample: Stoic = {
  framework: "stoic",
  category: meta.category,
  title: "My layoff was announced. How do I think about this?",
  yours: ["how I respond", "what I learn", "how I treat colleagues", "my next application", "my morning routine"],
  notYours: ["the layoff itself", "the macro economy", "what others say", "whether they liked me", "the timing"],
  recommendation: "Spend mornings on what's yours: applications, reading, exercise. Stop replaying meetings — those are not yours.",
};

export type Side = "yours" | "notYours";

export function getMetrics(d: Stoic) {
  return [
    { k: "Yours", v: String(d.yours.length) },
    { k: "Not yours", v: String(d.notYours.length) },
  ];
}
