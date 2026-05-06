import { z } from "zod";

export const PHASES = ["D", "M", "A", "I", "C"] as const;
export type DmaicPhase = (typeof PHASES)[number];

export const meta = {
  id: "dmaic",
  name: "DMAIC (Six Sigma)",
  category: "Operations & quality",
  blurb: "Define · Measure · Analyze · Improve · Control. The Six Sigma improvement spine.",
} as const;

export const schema = z.object({
  framework: z.literal("dmaic"),
  category: z.string(),
  title: z.string(),
  problem: z.string(),
  phases: z.object({
    D: z.string(),
    M: z.string(),
    A: z.string(),
    I: z.string(),
    C: z.string(),
  }),
  current: z.enum(PHASES),
  recommendation: z.string(),
});
export type Dmaic = z.infer<typeof schema>;

export const sample: Dmaic = {
  framework: "dmaic",
  category: meta.category,
  title: "Reduce checkout-step abandonment from 18% → 9%",
  problem: "Checkout abandons spike on the address-entry step, costing ~$220k/mo in lost revenue.",
  phases: {
    D: "Scope: web checkout only. Goal: cut step-3 abandon from 18% to ≤9% by Q4. Sponsor: VP Growth.",
    M: "Funnel logging at every step. Baseline 18% step-3 abandon (4 weeks). CTQ: completion time, error rate, abandon rate.",
    A: "Top causes by Pareto: address validation 401s (38%), tax surprise (24%), CVV mismatch (17%). DOE on 3 fixes.",
    I: "Async address validation with fuzzy match; show tax estimate at step 1; CVV inline validation.",
    C: "SPC chart on weekly abandon; alert if > 11% for 2 consecutive weeks. Owner: payments team. Re-baseline quarterly.",
  },
  current: "I",
  recommendation: "On track to halve abandonment. Lock the SPC chart in Control before stakeholders declare victory.",
};

export const META: Record<DmaicPhase, { word: string; q: string }> = {
  D: { word: "Define", q: "scope, goal, sponsor" },
  M: { word: "Measure", q: "baseline & CTQ metrics" },
  A: { word: "Analyze", q: "root causes" },
  I: { word: "Improve", q: "test & implement fix" },
  C: { word: "Control", q: "lock the gain" },
};

export function getMetrics(d: Dmaic) {
  return [
    { k: "Phase", v: META[d.current].word },
    { k: "Progress", v: `${PHASES.indexOf(d.current) + 1}/5` },
  ];
}
