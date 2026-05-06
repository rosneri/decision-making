import { z } from "zod";

export const meta = {
  id: "elo",
  name: "Elo Rating",
  category: "Sports analytics",
  blurb: "Pairwise rating system: win against a stronger opponent gains more points.",
} as const;

export const schema = z.object({
  framework: z.literal("elo"),
  category: z.string(),
  title: z.string(),
  k: z.number().min(8).max(64),
  players: z.array(z.object({
    name: z.string(),
    rating: z.number().int().min(0),
  })).min(2).max(20),
  matches: z.array(z.object({
    a: z.number().int(),
    b: z.number().int(),
    result: z.enum(["A", "B", "draw"]),
  })).min(0).max(40),
  recommendation: z.string(),
});
export type Elo = z.infer<typeof schema>;

export const sample: Elo = {
  framework: "elo",
  category: meta.category,
  title: "Club tournament — March cycle",
  k: 32,
  players: [
    { name: "Alex", rating: 1500 },
    { name: "Bea", rating: 1620 },
    { name: "Cam", rating: 1450 },
    { name: "Dee", rating: 1580 },
  ],
  matches: [
    { a: 0, b: 1, result: "A" },
    { a: 2, b: 3, result: "B" },
    { a: 0, b: 3, result: "draw" },
    { a: 1, b: 2, result: "A" },
  ],
  recommendation: "Alex's upset over Bea drives the biggest rating swing. Top of the table after the cycle: Bea, Dee, Alex, Cam.",
};

function expected(rA: number, rB: number) {
  return 1 / (1 + Math.pow(10, (rB - rA) / 400));
}

export function ratingsAfter(d: Elo) {
  const r = d.players.map((p) => p.rating);
  for (const m of d.matches) {
    if (m.a < 0 || m.b < 0 || m.a >= r.length || m.b >= r.length) continue;
    const Ea = expected(r[m.a]!, r[m.b]!);
    const Sa = m.result === "A" ? 1 : m.result === "draw" ? 0.5 : 0;
    const delta = d.k * (Sa - Ea);
    r[m.a] = Math.round(r[m.a]! + delta);
    r[m.b] = Math.round(r[m.b]! - delta);
  }
  return r;
}

export function getMetrics(d: Elo) {
  const r = ratingsAfter(d);
  const top = r.map((rating, i) => ({ rating, name: d.players[i]!.name })).sort((a, b) => b.rating - a.rating)[0];
  return [
    { k: "Top", v: top?.name ?? "" },
    { k: "Rating", v: String(top?.rating ?? 0) },
  ];
}
