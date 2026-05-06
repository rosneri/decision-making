import { z } from "zod";

export const meta = {
  id: "ice",
  name: "ICE Score",
  category: "Speed & prioritization",
  blurb: "Impact × Confidence × Ease. Lightweight prioritization when RICE is overkill.",
} as const;

export const schema = z.object({
  framework: z.literal("ice"),
  category: z.string(),
  title: z.string(),
  ideas: z.array(z.object({
    name: z.string(),
    impact: z.number().int().min(1).max(10),
    confidence: z.number().int().min(1).max(10),
    ease: z.number().int().min(1).max(10),
  })).min(2).max(20),
  recommendation: z.string(),
});
export type Ice = z.infer<typeof schema>;

export const sample: Ice = {
  framework: "ice",
  category: meta.category,
  title: "Q3 growth experiments — what to run first?",
  ideas: [
    { name: "Onboarding nudge email at day 3", impact: 7, confidence: 8, ease: 9 },
    { name: "Add referral program", impact: 9, confidence: 5, ease: 4 },
    { name: "Rewrite pricing page", impact: 6, confidence: 7, ease: 7 },
    { name: "Build mobile app", impact: 10, confidence: 4, ease: 1 },
  ],
  recommendation: "Onboarding nudge wins on ICE (504). Run it this sprint; queue the pricing page next.",
};

export function score(i: Ice["ideas"][number]) {
  return i.impact * i.confidence * i.ease;
}

export function getMetrics(d: Ice) {
  const ranked = [...d.ideas].sort((a, b) => score(b) - score(a));
  return [
    { k: "Top", v: ranked[0]?.name ?? "" },
    { k: "Score", v: String(score(ranked[0]!)) },
  ];
}
