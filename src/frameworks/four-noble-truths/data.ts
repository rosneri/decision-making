import { z } from "zod";

export const TRUTHS = ["dukkha", "samudaya", "nirodha", "magga"] as const;
export type Truth = (typeof TRUTHS)[number];

export const meta = {
  id: "four_noble_truths",
  name: "Four Noble Truths",
  category: "Spiritual & philosophical",
  blurb: "Suffering exists · has a cause · can end · the path to ending it.",
} as const;

export const schema = z.object({
  framework: z.literal("four_noble_truths"),
  category: z.string(),
  title: z.string(),
  situation: z.string(),
  truths: z.object({
    dukkha: z.string(),
    samudaya: z.string(),
    nirodha: z.string(),
    magga: z.array(z.string()).min(1).max(8),
  }),
  recommendation: z.string(),
});
export type FourNobleTruths = z.infer<typeof schema>;

export const sample: FourNobleTruths = {
  framework: "four_noble_truths",
  category: meta.category,
  title: "Why am I always anxious about my career?",
  situation: "Persistent anxiety about whether my work matters or I'm 'behind' my peers.",
  truths: {
    dukkha: "I feel chronic, low-grade dread about career — not specific events, just a fog.",
    samudaya: "Craving: a stable identity as 'successful' that I can never finally secure. Aversion to falling behind.",
    nirodha: "If I let go of identifying my worth with a comparative ranking, the dread loses its hook.",
    magga: [
      "Right view: success is a moving social construct, not a fixed reality",
      "Right intention: do work that matters to me, not the audience in my head",
      "Right effort: notice the comparison thought, label it, return to the task",
      "Right mindfulness: 10 min daily sit; track frequency of anxiety, not its content",
    ],
  },
  recommendation: "Cause is identification with comparative status. Path: practice noticing-and-letting-go daily. Concrete first step is the 10-min sit.",
};

export const META: Record<Truth, { word: string; q: string }> = {
  dukkha: { word: "Dukkha", q: "name the suffering" },
  samudaya: { word: "Samudaya", q: "the craving / cause" },
  nirodha: { word: "Nirodha", q: "ending is possible" },
  magga: { word: "Magga", q: "the path · concrete steps" },
};

export function getMetrics(d: FourNobleTruths) {
  return [
    { k: "Path steps", v: String(d.truths.magga.length) },
  ];
}
