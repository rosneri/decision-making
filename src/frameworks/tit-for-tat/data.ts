import { z } from "zod";


export const meta = {
  id: "tit_for_tat",
  name: "Tit-for-Tat",
  category: "Game theory & negotiation",
  blurb: "Cooperate first, mirror their move, forgive quickly. Wins repeated games.",
} as const;

export const schema = z.object({
  framework: z.literal("tit_for_tat"),
  category: z.string(),
  title: z.string(),
  rounds: z.array(z.object({
    them: z.enum(["C", "D"]),
  })).min(1).max(20),
  recommendation: z.string(),
});
export type TitForTat = z.infer<typeof schema>;

export const sample: TitForTat = {
  framework: "tit_for_tat",
  category: meta.category,
  title: "My contractor underdelivered. Cooperate or punish?",
  rounds: [
    { them: "C" }, { them: "C" }, { them: "D" }, { them: "D" }, { them: "C" },
    { them: "C" }, { them: "C" }, { them: "D" }, { them: "D" }, { them: "D" },
  ],
  recommendation: "Mirror once, then re-offer cooperation. Persistent defection (3+ rounds) signals it's time to exit.",
};

export function strategy(them: ("C" | "D")[]): ("C" | "D")[] {
  // start cooperating, then mirror their previous move
  return them.map((_, i) => i === 0 ? "C" : them[i - 1]!);
}
