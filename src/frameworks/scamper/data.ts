import { z } from "zod";

export const PROMPTS = ["S", "C", "A", "M", "P", "E", "R"] as const;
export type Prompt = (typeof PROMPTS)[number];

export const PROMPT_META: Record<Prompt, { word: string; q: string }> = {
  S: { word: "Substitute", q: "What can be swapped — material, person, ingredient?" },
  C: { word: "Combine", q: "What two things can be merged?" },
  A: { word: "Adapt", q: "What from another field could be adapted in?" },
  M: { word: "Modify", q: "What can be magnified, minified, or reshaped?" },
  P: { word: "Put to other use", q: "Who else could use this, or in what other context?" },
  E: { word: "Eliminate", q: "What can be removed entirely?" },
  R: { word: "Reverse / Rearrange", q: "What if the order or roles flipped?" },
};

export const meta = {
  id: "scamper",
  name: "SCAMPER",
  category: "Innovation & creativity",
  blurb: "Seven divergent prompts (Substitute, Combine, Adapt, Modify, Put-to-use, Eliminate, Reverse).",
} as const;

export const schema = z.object({
  framework: z.literal("scamper"),
  category: z.string(),
  title: z.string(),
  subject: z.string(),
  ideas: z.object({
    S: z.array(z.string()).min(0).max(8),
    C: z.array(z.string()).min(0).max(8),
    A: z.array(z.string()).min(0).max(8),
    M: z.array(z.string()).min(0).max(8),
    P: z.array(z.string()).min(0).max(8),
    E: z.array(z.string()).min(0).max(8),
    R: z.array(z.string()).min(0).max(8),
  }),
  recommendation: z.string(),
});
export type Scamper = z.infer<typeof schema>;

export const sample: Scamper = {
  framework: "scamper",
  category: meta.category,
  title: "Reimagine the gym membership",
  subject: "Monthly gym membership",
  ideas: {
    S: ["Substitute monthly fee with per-visit credits"],
    C: ["Combine with healthcare benefits — employer reimbursement"],
    A: ["Adapt Spotify-style 'family plan' for households"],
    M: ["Minify locations to lockers + on-demand trainer"],
    P: ["Use empty 9–4 capacity as co-working with showers"],
    E: ["Eliminate annual contract; pay-as-you-go"],
    R: ["Reverse — gym pays you for showing up (insurance discount)"],
  },
  recommendation: "Strongest combo: Eliminate contract + Substitute pricing → 'Spotify for fitness'. Test in one city.",
};

export function getMetrics(d: Scamper) {
  const total = PROMPTS.reduce((n, p) => n + d.ideas[p].length, 0);
  const used = PROMPTS.filter((p) => d.ideas[p].length > 0).length;
  return [
    { k: "Ideas", v: String(total) },
    { k: "Prompts used", v: `${used}/7` },
  ];
}
