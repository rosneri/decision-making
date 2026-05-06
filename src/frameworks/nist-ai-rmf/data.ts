import { z } from "zod";

export const FUNCTIONS = ["GOVERN", "MAP", "MEASURE", "MANAGE"] as const;
export type RmfFn = (typeof FUNCTIONS)[number];

export const meta = {
  id: "nist_ai_rmf",
  name: "NIST AI RMF",
  category: "AI alignment",
  blurb: "Govern · Map · Measure · Manage. The four functions of trustworthy-AI risk.",
} as const;

export const schema = z.object({
  framework: z.literal("nist_ai_rmf"),
  category: z.string(),
  title: z.string(),
  system: z.string(),
  functions: z.object({
    GOVERN: z.array(z.string()).min(1).max(8),
    MAP: z.array(z.string()).min(1).max(8),
    MEASURE: z.array(z.string()).min(1).max(8),
    MANAGE: z.array(z.string()).min(1).max(8),
  }),
  riskLevel: z.enum(["low", "medium", "high"]),
  recommendation: z.string(),
});
export type NistAiRmf = z.infer<typeof schema>;

export const sample: NistAiRmf = {
  framework: "nist_ai_rmf",
  category: meta.category,
  title: "Hiring screening model — risk profile",
  system: "Resume-ranker LLM, deployed in ATS",
  functions: {
    GOVERN: ["AI policy signed by CEO", "Quarterly model-risk review"],
    MAP: ["Use case: rank top 25 of 1000 resumes", "Affected: applicants in protected classes"],
    MEASURE: ["Disparate-impact audit (4/5ths rule)", "Calibration on holdout by demographic"],
    MANAGE: ["Human-in-the-loop on every reject", "Kill switch if DI ratio < 0.8"],
  },
  riskLevel: "high",
  recommendation: "High-risk system. Require pre-deployment bias audit and ongoing DI monitoring; gate ship on GOVERN sign-off.",
};

const META: Record<RmfFn, { note: string }> = {
  GOVERN: { note: "policies & accountability" },
  MAP: { note: "context & impacted parties" },
  MEASURE: { note: "metrics & audits" },
  MANAGE: { note: "controls & response" },
};
export { META };

export function getMetrics(d: NistAiRmf) {
  const total = FUNCTIONS.reduce((n, f) => n + d.functions[f].length, 0);
  return [
    { k: "Risk", v: d.riskLevel.toUpperCase() },
    { k: "Controls", v: String(total) },
  ];
}
