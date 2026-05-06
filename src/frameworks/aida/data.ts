import { z } from "zod";

export const STAGES = ["A", "I", "D", "Action"] as const;
export type AidaStage = (typeof STAGES)[number];

export const meta = {
  id: "aida",
  name: "AIDA",
  category: "Sales & marketing",
  blurb: "Attention · Interest · Desire · Action — the funnel that any pitch must walk through.",
} as const;

export const schema = z.object({
  framework: z.literal("aida",),
  category: z.string(),
  title: z.string(),
  audience: z.string(),
  attention: z.string(),
  interest: z.string(),
  desire: z.string(),
  action: z.string(),
  recommendation: z.string(),
});
export type Aida = z.infer<typeof schema>;

export const sample: Aida = {
  framework: "aida",
  category: meta.category,
  title: "Landing page for a new B2B time-tracking tool",
  audience: "Operations leads at 50–500-person services firms",
  attention: "Headline: 'Your team isn't slow — your timesheets are.' Above-fold demo gif (2s).",
  interest: "3 customer logos + 'cut billing-cycle effort by 70%' stat with linked case study.",
  desire: "Side-by-side ROI calculator showing $X recovered/yr at their team size.",
  action: "'Try free for 14 days — no credit card.' CTA button repeats above-fold and below ROI.",
  recommendation: "Strong A→I→D→A flow. Test the headline against a benefit-led variant; ROI calc is the key conversion lever.",
};

export const META: Record<AidaStage, { word: string; q: string }> = {
  A: { word: "Attention", q: "stop the scroll" },
  I: { word: "Interest", q: "earn another 10 seconds" },
  D: { word: "Desire", q: "make them want it" },
  Action: { word: "Action", q: "the single, frictionless ask" },
};

export function getMetrics(d: Aida) {
  const filled = [d.attention, d.interest, d.desire, d.action].filter((x) => x.length > 0).length;
  return [
    { k: "Stages", v: `${filled}/4` },
  ];
}
