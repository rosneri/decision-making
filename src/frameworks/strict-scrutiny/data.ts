import { z } from "zod";

export const TIERS = ["rational", "intermediate", "strict"] as const;
export type Tier = (typeof TIERS)[number];

export const meta = {
  id: "strict_scrutiny",
  name: "Strict Scrutiny",
  category: "Legal & judicial",
  blurb: "Compelling interest · narrowly tailored · least restrictive means. The highest constitutional bar.",
} as const;

export const schema = z.object({
  framework: z.literal("strict_scrutiny"),
  category: z.string(),
  title: z.string(),
  law: z.string(),
  tier: z.enum(TIERS),
  prongs: z.object({
    interest: z.object({ analysis: z.string(), satisfied: z.boolean() }),
    tailoring: z.object({ analysis: z.string(), satisfied: z.boolean() }),
    leastRestrictive: z.object({ analysis: z.string(), satisfied: z.boolean() }),
  }),
  recommendation: z.string(),
});
export type StrictScrutiny = z.infer<typeof schema>;

export const sample: StrictScrutiny = {
  framework: "strict_scrutiny",
  category: meta.category,
  title: "Campus speech-zone ordinance — does it survive strict scrutiny?",
  law: "City ordinance restricting protests to a 30×30 ft zone behind the building",
  tier: "strict",
  prongs: {
    interest: { analysis: "Government cites public safety. Compelling — settled doctrine on safety as compelling interest.", satisfied: true },
    tailoring: { analysis: "Restriction covers all expressive activity, not just disruptive — overbroad.", satisfied: false },
    leastRestrictive: { analysis: "Less restrictive alternatives (time/place/manner with permits) clearly available.", satisfied: false },
  },
  recommendation: "Compelling interest met, but ordinance fails tailoring and least-restrictive-means. Likely unconstitutional as written.",
};

export const TIER_META: Record<Tier, { label: string; note: string }> = {
  rational: { label: "Rational basis", note: "any legitimate interest, rationally related" },
  intermediate: { label: "Intermediate", note: "important interest, substantially related" },
  strict: { label: "Strict scrutiny", note: "compelling interest, narrowly tailored, LRA" },
};

export function getMetrics(d: StrictScrutiny) {
  const ok = d.prongs.interest.satisfied && d.prongs.tailoring.satisfied && d.prongs.leastRestrictive.satisfied;
  return [
    { k: "Tier", v: TIER_META[d.tier].label },
    { k: "Verdict", v: ok ? "survives" : "fails" },
  ];
}
