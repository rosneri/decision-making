import { z } from "zod";


export const meta = {
  id: "wpa",
  name: "Win Probability Added",
  category: "Sports analytics",
  blurb: "Pick the option that adds more expected win probability — not the one that 'feels' safer.",
} as const;

export const schema = z.object({
  framework: z.literal("wpa"),
  category: z.string(),
  title: z.string(),
  options: z.array(z.object({
    name: z.string(),
    wp: z.number().min(0).max(1),
    note: z.string(),
  })).min(2).max(6),
  recommendation: z.string(),
});
export type Wpa = z.infer<typeof schema>;

export const sample: Wpa = {
  framework: "wpa",
  category: meta.category,
  title: "4th & 2 from your own 38. Punt or go?",
  options: [
    { name: "Punt", wp: 0.41, note: "opp gets ball at own 25" },
    { name: "Go for it", wp: 0.47, note: "0.68 convert × .56 (with FD) + .32 × .28 (turnover)" },
  ],
  recommendation: "Going for it adds +6 WP%. The math says go even though the gut says punt.",
};

export function getMetrics(d: Wpa) {
  const top = d.options.reduce((b, o) => (o.wp > b.wp ? o : b), d.options[0]!);
  return [
    { k: "Pick", v: top.name },
    { k: "WP", v: `${(top.wp * 100).toFixed(0)}%` },
  ];
}
