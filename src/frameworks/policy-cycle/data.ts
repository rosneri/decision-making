import { z } from "zod";

export const STAGES = ["agenda", "formulation", "adoption", "implementation", "evaluation"] as const;
export type Stage = (typeof STAGES)[number];

export const meta = {
  id: "policy_cycle",
  name: "Policy Cycle",
  category: "Public policy",
  blurb: "Five stages from problem to evaluation — and back to the agenda.",
} as const;

export const schema = z.object({
  framework: z.literal("policy_cycle"),
  category: z.string(),
  title: z.string(),
  problem: z.string(),
  stages: z.object({
    agenda: z.string(),
    formulation: z.string(),
    adoption: z.string(),
    implementation: z.string(),
    evaluation: z.string(),
  }),
  current: z.enum(STAGES),
  recommendation: z.string(),
});
export type PolicyCycle = z.infer<typeof schema>;

export const sample: PolicyCycle = {
  framework: "policy_cycle",
  category: meta.category,
  title: "Lead service-line replacement program",
  problem: "12% of service lines in the city are still lead — disproportionately in lower-income neighborhoods.",
  stages: {
    agenda: "EPA inventory rule + 2023 testing data put this on the council's agenda.",
    formulation: "Three options: (a) full replacement in 10 yrs, (b) phased by hot-spot, (c) homeowner cost-share.",
    adoption: "Council votes Option (b) — phased. Funded by water surcharge + state match.",
    implementation: "Public Works begins in EJ census tracts; contracted plumbers; tenant-protection clause.",
    evaluation: "Annual lead-test panel; equity audit at year 3; cost-per-line tracked.",
  },
  current: "implementation",
  recommendation: "Lock the year-3 equity audit before momentum stalls. Start writing the year-3 program review now.",
};

export const META: Record<Stage, { word: string; q: string }> = {
  agenda: { word: "Agenda Setting", q: "what reaches the table" },
  formulation: { word: "Formulation", q: "options & analysis" },
  adoption: { word: "Adoption", q: "decision & legitimation" },
  implementation: { word: "Implementation", q: "delivery on the ground" },
  evaluation: { word: "Evaluation", q: "did it work?" },
};

export function getMetrics(d: PolicyCycle) {
  return [
    { k: "Stage", v: META[d.current].word },
    { k: "Phase", v: `${STAGES.indexOf(d.current) + 1}/5` },
  ];
}
