import { z } from "zod";


export const meta = {
  id: "regret_min",
  name: "Regret Minimization",
  category: "Career & life design",
  blurb: "Project to age 80. Look back. Which choice would you regret not taking?",
} as const;

export const schema = z.object({
  framework: z.literal("regret_min"),
  category: z.string(),
  title: z.string(),
  options: z.array(z.object({
    name: z.string(),
    regretIfTaken: z.number().int().min(1).max(10),
    regretIfNotTaken: z.number().int().min(1).max(10),
    eightyYrThought: z.string(),
  })).min(2).max(6),
  recommendation: z.string(),
});
export type RegretMin = z.infer<typeof schema>;

export const sample: RegretMin = {
  framework: "regret_min",
  category: meta.category,
  title: "Take the moonshot job, or the safe one?",
  options: [
    { name: "Moonshot", regretIfTaken: 2, regretIfNotTaken: 8, eightyYrThought: "glad I tried." },
    { name: "Safe job", regretIfTaken: 6, regretIfNotTaken: 3, eightyYrThought: "what if?" },
  ],
  recommendation: "Moonshot has 6× regret-asymmetry. Take it; the floor is recoverable, the ceiling isn't.",
};

export function bestOption(d: RegretMin) {
  const scored = d.options.map((o, i) => ({ ...o, i, asymmetry: o.regretIfNotTaken - o.regretIfTaken }));
  return scored.reduce((a, x) => x.asymmetry > a.asymmetry ? x : a, scored[0]!);
}

export function getMetrics(d: RegretMin) {
  const best = bestOption(d);
  return [
    { k: "Pick", v: best.name, testId: "regret-best" },
    { k: "Asymmetry", v: (best.asymmetry > 0 ? "+" : "") + best.asymmetry },
  ];
}
