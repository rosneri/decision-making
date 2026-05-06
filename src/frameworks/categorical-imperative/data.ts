import { z } from "zod";

export const TESTS = ["universalize", "humanity", "kingdom"] as const;
export type KantTest = (typeof TESTS)[number];

export const meta = {
  id: "categorical_imperative",
  name: "Categorical Imperative",
  category: "Ethical & moral",
  blurb: "Kant's three tests: could it be a universal law? Use no one as mere means? Pass a kingdom of ends?",
} as const;

export const schema = z.object({
  framework: z.literal("categorical_imperative"),
  category: z.string(),
  title: z.string(),
  maxim: z.string(),
  tests: z.object({
    universalize: z.object({ analysis: z.string(), passes: z.boolean() }),
    humanity: z.object({ analysis: z.string(), passes: z.boolean() }),
    kingdom: z.object({ analysis: z.string(), passes: z.boolean() }),
  }),
  recommendation: z.string(),
});
export type CategoricalImperative = z.infer<typeof schema>;

export const sample: CategoricalImperative = {
  framework: "categorical_imperative",
  category: meta.category,
  title: "May I lie to a colleague to win a deal?",
  maxim: "I will misrepresent the product roadmap to close a sale.",
  tests: {
    universalize: { analysis: "If everyone misrepresented to close, no one would believe sales claims. The institution of selling collapses.", passes: false },
    humanity: { analysis: "I'm using the customer purely as a means to my quota — denying them the information needed to choose freely.", passes: false },
    kingdom: { analysis: "In a community of rational agents, no one would consent to be lied to. The act can't be law in such a community.", passes: false },
  },
  recommendation: "All three tests fail. Don't act on this maxim — find a maxim that passes (e.g., 'be transparent about uncertainty').",
};

export const META: Record<KantTest, { label: string; q: string }> = {
  universalize: { label: "1. Universal Law", q: "Could everyone act on this maxim?" },
  humanity: { label: "2. Humanity", q: "Does it treat persons as ends, never merely means?" },
  kingdom: { label: "3. Kingdom of Ends", q: "Could rational agents legislate this together?" },
};

export function getMetrics(d: CategoricalImperative) {
  const passes = TESTS.filter((t) => d.tests[t].passes).length;
  return [
    { k: "Tests passed", v: `${passes}/3` },
    { k: "Verdict", v: passes === 3 ? "permissible" : "impermissible" },
  ];
}
