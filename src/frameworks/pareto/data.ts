import { z } from "zod";

export const meta = {
  id: "pareto",
  name: "Pareto (80/20)",
  category: "Analysis & evaluation",
  blurb: "Most of the impact comes from a few causes. Find them; cut the rest.",
} as const;

export const schema = z.object({
  framework: z.literal("pareto"),
  category: z.string(),
  title: z.string(),
  metric: z.string(),
  causes: z.array(z.object({
    name: z.string(),
    contribution: z.number().min(0),
  })).min(2).max(12),
  recommendation: z.string(),
});
export type Pareto = z.infer<typeof schema>;

export const sample: Pareto = {
  framework: "pareto",
  category: meta.category,
  title: "Where do our customer-support tickets actually come from?",
  metric: "tickets / week",
  causes: [
    { name: "billing confusion", contribution: 240 },
    { name: "slow imports", contribution: 180 },
    { name: "password reset", contribution: 60 },
    { name: "mobile crashes", contribution: 30 },
    { name: "feature questions", contribution: 20 },
    { name: "other", contribution: 10 },
  ],
  recommendation: "Billing + imports = 78% of tickets. Fix those first; everything else is noise.",
};

export function getMetrics(d: Pareto) {
  const sorted = [...d.causes].sort((a, b) => b.contribution - a.contribution);
  const total = sorted.reduce((n, c) => n + c.contribution, 0);
  let cum = 0;
  let vital = 0;
  for (const c of sorted) {
    cum += c.contribution;
    vital++;
    if (cum / total >= 0.8) break;
  }
  return [
    { k: "Vital few", v: `${vital}/${d.causes.length}` },
    { k: "Top driver", v: sorted[0]?.name ?? "" },
  ];
}
