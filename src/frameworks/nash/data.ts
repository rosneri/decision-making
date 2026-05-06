import { z } from "zod";

export const meta = {
  id: "nash",
  name: "Nash Equilibrium",
  category: "Game theory & negotiation",
  blurb: "A 2×2 payoff matrix. Find the strategy pair where neither player wants to deviate.",
} as const;

export const schema = z.object({
  framework: z.literal("nash"),
  category: z.string(),
  title: z.string(),
  rowPlayer: z.string(),
  colPlayer: z.string(),
  rowStrategies: z.tuple([z.string(), z.string()]),
  colStrategies: z.tuple([z.string(), z.string()]),
  // payoffs[r][c] = [rowPayoff, colPayoff]
  payoffs: z.tuple([
    z.tuple([z.tuple([z.number(), z.number()]), z.tuple([z.number(), z.number()])]),
    z.tuple([z.tuple([z.number(), z.number()]), z.tuple([z.number(), z.number()])]),
  ]),
  recommendation: z.string(),
});
export type Nash = z.infer<typeof schema>;

export const sample: Nash = {
  framework: "nash",
  category: meta.category,
  title: "Prisoner's Dilemma — confess or stay silent?",
  rowPlayer: "Alice",
  colPlayer: "Bob",
  rowStrategies: ["Cooperate", "Defect"],
  colStrategies: ["Cooperate", "Defect"],
  payoffs: [
    [[3, 3], [0, 5]],
    [[5, 0], [1, 1]],
  ],
  recommendation: "(Defect, Defect) is the Nash equilibrium — both worse than (Cooperate, Cooperate) but neither can unilaterally improve.",
};

export function findNash(d: Nash): Array<[number, number]> {
  const eqs: Array<[number, number]> = [];
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) {
      const [rp, cp] = d.payoffs[r]![c]!;
      // row player: any deviation
      const rOther = d.payoffs[1 - r]![c]![0];
      // col player: any deviation
      const cOther = d.payoffs[r]![1 - c]![1];
      if (rp >= rOther && cp >= cOther) eqs.push([r, c]);
    }
  }
  return eqs;
}

export function getMetrics(d: Nash) {
  const eqs = findNash(d);
  return [
    { k: "Equilibria", v: String(eqs.length) },
    {
      k: "Outcome",
      v: eqs.length === 1
        ? `${d.rowStrategies[eqs[0]![0]]}/${d.colStrategies[eqs[0]![1]]}`
        : eqs.length === 0 ? "mixed only" : "multiple",
    },
  ];
}
