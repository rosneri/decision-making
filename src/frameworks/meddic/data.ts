import { z } from "zod";


export const KEYS = ["metrics", "economic_buyer", "decision_criteria", "decision_process", "identify_pain", "champion"] as const;
export type Key = (typeof KEYS)[number];

export const meta = {
  id: "meddic",
  name: "MEDDIC",
  category: "Sales & marketing",
  blurb: "Six qualifiers. The empty box is your real risk.",
} as const;

export const schema = z.object({
  framework: z.literal("meddic"),
  category: z.string(),
  title: z.string(),
  cells: z.object({
    metrics: z.object({ answer: z.string(), confirmed: z.boolean() }),
    economic_buyer: z.object({ answer: z.string(), confirmed: z.boolean() }),
    decision_criteria: z.object({ answer: z.string(), confirmed: z.boolean() }),
    decision_process: z.object({ answer: z.string(), confirmed: z.boolean() }),
    identify_pain: z.object({ answer: z.string(), confirmed: z.boolean() }),
    champion: z.object({ answer: z.string(), confirmed: z.boolean() }),
  }),
  recommendation: z.string(),
});
export type Meddic = z.infer<typeof schema>;

export const sample: Meddic = {
  framework: "meddic",
  category: meta.category,
  title: "Will the Acme deal close this quarter?",
  cells: {
    metrics: { answer: "save 2 FTE / quarter", confirmed: true },
    economic_buyer: { answer: "VP Eng — met once", confirmed: true },
    decision_criteria: { answer: "uptime 99.95", confirmed: true },
    decision_process: { answer: "Q3 review", confirmed: false },
    identify_pain: { answer: "incidents costing $200k/mo", confirmed: true },
    champion: { answer: "Priya · staff eng", confirmed: true },
  },
  recommendation: "Decision process is the gap. Get a written timeline before forecasting close-quarter.",
};

export const META: Record<Key, { letter: string; word: string }> = {
  metrics: { letter: "M", word: "Metrics" },
  economic_buyer: { letter: "E", word: "Econ. Buyer" },
  decision_criteria: { letter: "D", word: "Decision Criteria" },
  decision_process: { letter: "D", word: "Decision Process" },
  identify_pain: { letter: "I", word: "Identify Pain" },
  champion: { letter: "C", word: "Champion" },
};
