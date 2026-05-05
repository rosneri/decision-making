import { z } from "zod";


export const meta = {
  id: "learned_hand",
  name: "Learned Hand · B < PL",
  category: "Legal & judicial",
  blurb: "If burden of precaution < probability × loss, failing to take it is negligent.",
} as const;

export const schema = z.object({
  framework: z.literal("learned_hand"),
  category: z.string(),
  title: z.string(),
  burden: z.object({ value: z.number().min(0), label: z.string() }),
  probability: z.number().min(0).max(1),
  loss: z.number().min(0),
  recommendation: z.string(),
});
export type LearnedHand = z.infer<typeof schema>;

export const sample: LearnedHand = {
  framework: "learned_hand",
  category: meta.category,
  title: "Is the warehouse owner liable for the slip-and-fall?",
  burden: { value: 2400, label: "install non-slip mats" },
  probability: 0.06,
  loss: 300000,
  recommendation: "B ($2.4k) < PL ($18k). The precaution was cheap; failing to take it is negligent under Hand.",
};
