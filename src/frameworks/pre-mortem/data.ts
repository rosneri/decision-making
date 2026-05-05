import { z } from "zod";


export const meta = {
  id: "pre_mortem",
  name: "Pre-Mortem",
  category: "Cognitive & behavioral",
  blurb: "Imagine the failure has already happened. List why — then plan tripwires.",
} as const;

export const schema = z.object({
  framework: z.literal("pre_mortem"),
  category: z.string(),
  title: z.string(),
  scenario: z.string(),
  risks: z.array(z.object({
    cause: z.string(),
    likelihood: z.number().int().min(1).max(5),
    impact: z.number().int().min(1).max(5),
  })).min(1).max(20),
  recommendation: z.string(),
});
export type PreMortem = z.infer<typeof schema>;

export const sample: PreMortem = {
  framework: "pre_mortem",
  category: meta.category,
  title: "Imagine the launch failed. Why?",
  scenario: "It is 6 months from now. The launch was a disaster.",
  risks: [
    { cause: "we picked the wrong launch date", likelihood: 4, impact: 3 },
    { cause: "key engineer leaves mid-build", likelihood: 3, impact: 5 },
    { cause: "marketing missed the window", likelihood: 2, impact: 4 },
    { cause: "scope crept by 40%", likelihood: 5, impact: 3 },
    { cause: "the data was wrong from day one", likelihood: 1, impact: 5 },
  ],
  recommendation: "Two risks need tripwires now: scope creep (set a kill-feature trigger) and key-engineer dependency (pair them with a backup).",
};

export function getMetrics(d: PreMortem) {
  const scored = d.risks.map((r) => ({ ...r, score: r.likelihood * r.impact }));
  const top = scored.reduce((b, r) => (r.score > b.score ? r : b), scored[0]!);
  return [
    { k: "Top risk", v: top.cause.length > 40 ? top.cause.slice(0, 40) + "…" : top.cause },
    { k: "L×I", v: String(top.score) },
  ];
}
