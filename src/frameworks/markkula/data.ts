import { z } from "zod";


export const LENSES = ["utilitarian", "rights", "justice", "commonGood", "virtue"] as const;
export type Lens = (typeof LENSES)[number];

export const meta = {
  id: "markkula",
  name: "Markkula Framework",
  category: "Ethical & moral",
  blurb: "Five ethical lenses. The weakest one is your real risk.",
} as const;

export const schema = z.object({
  framework: z.literal("markkula"),
  category: z.string(),
  title: z.string(),
  scores: z.object({
    utilitarian: z.number().int().min(0).max(5),
    rights: z.number().int().min(0).max(5),
    justice: z.number().int().min(0).max(5),
    commonGood: z.number().int().min(0).max(5),
    virtue: z.number().int().min(0).max(5),
  }),
  notes: z.object({
    utilitarian: z.string(),
    rights: z.string(),
    justice: z.string(),
    commonGood: z.string(),
    virtue: z.string(),
  }),
  recommendation: z.string(),
});
export type Markkula = z.infer<typeof schema>;

export const sample: Markkula = {
  framework: "markkula",
  category: meta.category,
  title: "Use facial recognition for store entry?",
  scores: { utilitarian: 4, rights: 2, justice: 2, commonGood: 4, virtue: 3 },
  notes: {
    utilitarian: "shorter lines, less theft",
    rights: "biometric capture without explicit consent",
    justice: "false-match bias hits some demographics harder",
    commonGood: "fewer staff incidents",
    virtue: "is this the kind of business we want to be?",
  },
  recommendation: "Rights and Justice are weak. Don't ship without consent flow + bias audit.",
};

export const META: Record<Lens, { label: string; q: string }> = {
  utilitarian: { label: "Utilitarian", q: "greatest good?" },
  rights: { label: "Rights", q: "respects dignity?" },
  justice: { label: "Justice", q: "fair to all?" },
  commonGood: { label: "Common Good", q: "serves community?" },
  virtue: { label: "Virtue", q: "person you want to be?" },
};

export function getMetrics(d: Markkula) {
  const entries = Object.entries(d.scores) as [keyof typeof d.scores, number][];
  const min = entries.reduce((b, e) => (e[1] < b[1] ? e : b), entries[0]!);
  const total = entries.reduce((s, [, v]) => s + v, 0);
  return [
    { k: "Avg", v: (total / entries.length).toFixed(1) },
    { k: "Weakest lens", v: String(min[0]) },
  ];
}
