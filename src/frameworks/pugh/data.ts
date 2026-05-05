import { z } from "zod";


export const VALUES = ["+", "S", "-"] as const;
export type Val = (typeof VALUES)[number];

export const meta = {
  id: "pugh",
  name: "Pugh Matrix",
  category: "Engineering & systems",
  blurb: "Score concepts +/−/S vs a datum. Net positives win.",
} as const;

export const schema = z.object({
  framework: z.literal("pugh"),
  category: z.string(),
  title: z.string(),
  datum: z.string(),
  concepts: z.array(z.string()).min(1).max(8),
  criteria: z.array(z.object({
    name: z.string(),
    scores: z.array(z.enum(VALUES)),
  })).min(1).max(20),
  recommendation: z.string(),
});
export type Pugh = z.infer<typeof schema>;

export const sample: Pugh = {
  framework: "pugh",
  category: meta.category,
  title: "Pick the cooling system concept to prototype.",
  datum: "Concept A",
  concepts: ["Concept B", "Concept C", "Concept D"],
  criteria: [
    { name: "cost", scores: ["+", "-", "+"] },
    { name: "weight", scores: ["-", "+", "+"] },
    { name: "ease", scores: ["+", "+", "-"] },
    { name: "speed", scores: ["-", "-", "+"] },
    { name: "noise", scores: ["+", "S", "+"] },
  ],
  recommendation: "Concept D wins on net (+3). Prototype it; check the speed claim early since two concepts beat A there.",
};

export const cycle = (v: Val): Val => v === "+" ? "S" : v === "S" ? "-" : "+";

export function getMetrics(d: Pugh) {
  const scores = d.concepts.map((_, ci) =>
    d.criteria.reduce((s, c) => s + (c.scores[ci] === "+" ? 1 : c.scores[ci] === "-" ? -1 : 0), 0),
  );
  const best = scores.reduce((bi, s, i) => (s > (scores[bi] ?? -Infinity) ? i : bi), 0);
  const allLose = scores.every((s) => s <= 0);
  return [
    { k: "Winner", v: allLose ? d.datum : (d.concepts[best] ?? "—") },
    { k: "Net", v: (scores[best] ?? 0) > 0 ? `+${scores[best]}` : String(scores[best] ?? 0) },
  ];
}
