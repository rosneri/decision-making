import { z } from "zod";


export const meta = {
  id: "veil_of_ignorance",
  name: "Veil of Ignorance",
  category: "Ethical & moral",
  blurb: "You don't know which seat you'll wake up in. Would you still choose this?",
} as const;

export const schema = z.object({
  framework: z.literal("veil_of_ignorance"),
  category: z.string(),
  title: z.string(),
  scenario: z.string(),
  seats: z.array(z.object({
    who: z.string(),
    impact: z.string(),
    score: z.number().int().min(-5).max(5),
  })).min(1).max(20),
  recommendation: z.string(),
});
export type Veil = z.infer<typeof schema>;

export const sample: Veil = {
  framework: "veil_of_ignorance",
  category: meta.category,
  title: "Should we restructure and lay off 15%?",
  scenario: "You don't know which seat you'll wake up in.",
  seats: [
    { who: "the CEO", impact: "+$2M bonus", score: 5 },
    { who: "a tenured eng", impact: "no change", score: 0 },
    { who: "a contractor", impact: "lose contract", score: -4 },
    { who: "a junior PM", impact: "promoted", score: 3 },
    { who: "a customer", impact: "price up 8%", score: -1 },
    { who: "a future hire", impact: "fewer roles", score: -2 },
  ],
  recommendation: "Worst-off (contractors) take a -4. If you couldn't bear that seat, redesign the change before announcing it.",
};
