import { z } from "zod";


export const BLOCKS = ["I", "R", "A", "C"] as const;
export type Block = (typeof BLOCKS)[number];

export const meta = {
  id: "irac",
  name: "IRAC",
  category: "Legal & judicial",
  blurb: "Issue, Rule, Application, Conclusion — the legal-analysis spine.",
} as const;

export const schema = z.object({
  framework: z.literal("irac"),
  category: z.string(),
  title: z.string(),
  blocks: z.object({
    I: z.string(), R: z.string(), A: z.string(), C: z.string(),
  }),
  recommendation: z.string(),
});
export type Irac = z.infer<typeof schema>;

export const sample: Irac = {
  framework: "irac",
  category: meta.category,
  title: "Can my client take the competing job offer?",
  blocks: {
    I: "is the non-compete enforceable in CA?",
    R: "Cal. Bus. & Prof. § 16600 — void with narrow exceptions",
    A: "no sale-of-business exception · employee in CA · trade-secret carve-out NPE",
    C: "likely unenforceable · advise client to proceed",
  },
  recommendation: "Proceed with the new offer; document the carve-out limits and brief the client on trade-secret hygiene.",
};

export const META: Record<Block, { word: string }> = {
  I: { word: "Issue" }, R: { word: "Rule" }, A: { word: "Application" }, C: { word: "Conclusion" },
};

export function getMetrics(d: Irac) {
  const c = d.blocks.C ?? "";
  return [{ k: "Conclusion", v: c.length > 60 ? c.slice(0, 60) + "…" : (c || "—") }];
}
