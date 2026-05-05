import { z } from "zod";


export const meta = {
  id: "structured_interview",
  name: "Structured Interviewing",
  category: "Hiring & talent",
  blurb: "Same questions, same rubric, every candidate. Cuts gut bias roughly in half.",
} as const;

export const schema = z.object({
  framework: z.literal("structured_interview"),
  category: z.string(),
  title: z.string(),
  dimensions: z.array(z.string()).min(1).max(8),
  candidates: z.array(z.object({
    name: z.string(),
    scores: z.array(z.number().int().min(1).max(5)),
  })).min(1).max(10),
  recommendation: z.string(),
});
export type StructuredInterview = z.infer<typeof schema>;

export const sample: StructuredInterview = {
  framework: "structured_interview",
  category: meta.category,
  title: "Three finalists for the staff engineer role.",
  dimensions: ["coding", "systems", "collab", "ownership"],
  candidates: [
    { name: "Aria", scores: [4, 3, 5, 4] },
    { name: "Beni", scores: [5, 4, 2, 3] },
    { name: "Caro", scores: [3, 3, 4, 3] },
  ],
  recommendation: "Aria leads on average and is strongest on the most predictive dimensions (collab, ownership). Hire.",
};

export function getMetrics(d: StructuredInterview) {
  const scored = d.candidates.map((c) => ({
    name: c.name,
    avg: c.scores.reduce((s, x) => s + x, 0) / (c.scores.length || 1),
  }));
  const top = scored.reduce((b, c) => (c.avg > b.avg ? c : b), scored[0]!);
  return [
    { k: "Top", v: top.name },
    { k: "Avg", v: top.avg.toFixed(2) },
  ];
}
