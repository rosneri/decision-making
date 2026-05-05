import { z } from "zod";


export const meta = {
  id: "ignatian",
  name: "Ignatian Discernment",
  category: "Spiritual & philosophical",
  blurb: "Sit with each option for days; track consolation vs. desolation; favor steady consolation.",
} as const;

export const schema = z.object({
  framework: z.literal("ignatian"),
  category: z.string(),
  title: z.string(),
  options: z.array(z.object({
    name: z.string(),
    consolation: z.number().int().min(0).max(5),
    desolation: z.number().int().min(0).max(5),
    feeling: z.string(),
  })).min(2).max(4),
  days: z.array(z.string()).min(1).max(7),
  recommendation: z.string(),
});
export type Ignatian = z.infer<typeof schema>;

export const sample: Ignatian = {
  framework: "ignatian",
  category: meta.category,
  title: "Take the senior role, or step back to teach?",
  options: [
    { name: "Senior role", consolation: 2, desolation: 4, feeling: "chest tightens when I imagine it" },
    { name: "Teach", consolation: 5, desolation: 1, feeling: "feels like coming home" },
  ],
  days: ["B", "B", "B"],
  recommendation: "Steady consolation toward 'Teach' across all three days — a sign worth trusting. Take the next concrete step.",
};

export function getMetrics(d: Ignatian) {
  const scored = d.options.map((o) => ({ name: o.name, net: o.consolation - o.desolation }));
  const best = scored.reduce((b, o) => (o.net > b.net ? o : b), scored[0]!);
  return [
    { k: "Leaning", v: best.name },
    { k: "Consolation net", v: (best.net > 0 ? "+" : "") + best.net },
  ];
}
