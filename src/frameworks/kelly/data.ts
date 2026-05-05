import { z } from "zod";


export const meta = {
  id: "kelly",
  name: "Kelly Criterion",
  category: "Financial & investment",
  blurb: "Optimal bet sizing: f* = (bp − q) / b. Most pros bet half-Kelly to survive variance.",
} as const;

export const schema = z.object({
  framework: z.literal("kelly"),
  category: z.string(),
  title: z.string(),
  bankroll: z.number().min(0),
  oddsToOne: z.number().min(0),
  pWin: z.number().min(0).max(1),
  fraction: z.number().min(0).max(1),
  recommendation: z.string(),
});
export type Kelly = z.infer<typeof schema>;

export const sample: Kelly = {
  framework: "kelly",
  category: meta.category,
  title: "Friend offers a bet. How much do I wager?",
  bankroll: 10000,
  oddsToOne: 2,
  pWin: 0.55,
  fraction: 0.5,
  recommendation: "Full Kelly says ~32%. Cut to half-Kelly to absorb a losing streak. Wager ~$1,625.",
};

export function getMetrics(d: Kelly) {
  const f = (d.oddsToOne * d.pWin - (1 - d.pWin)) / (d.oddsToOne || 1);
  const wager = Math.max(0, f * d.fraction * d.bankroll);
  return [
    { k: "Kelly f*", v: `${(Math.max(0, f) * 100).toFixed(1)}%` },
    { k: "Wager", v: `$${wager.toFixed(0)}` },
  ];
}
