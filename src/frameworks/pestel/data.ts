import { z } from "zod";

export const FACTORS = ["Political", "Economic", "Social", "Technological", "Environmental", "Legal"] as const;
export type Factor = (typeof FACTORS)[number];

export const meta = {
  id: "pestel",
  name: "PESTEL",
  category: "Strategy & business",
  blurb: "Macro-environment scan: Political · Economic · Social · Technological · Environmental · Legal.",
} as const;

export const schema = z.object({
  framework: z.literal("pestel"),
  category: z.string(),
  title: z.string(),
  context: z.string(),
  factors: z.object({
    Political: z.array(z.string()).min(1).max(8),
    Economic: z.array(z.string()).min(1).max(8),
    Social: z.array(z.string()).min(1).max(8),
    Technological: z.array(z.string()).min(1).max(8),
    Environmental: z.array(z.string()).min(1).max(8),
    Legal: z.array(z.string()).min(1).max(8),
  }),
  recommendation: z.string(),
});
export type Pestel = z.infer<typeof schema>;

export const sample: Pestel = {
  framework: "pestel",
  category: meta.category,
  title: "Should we expand to the EU market?",
  context: "B2B SaaS targeting mid-market manufacturing in Germany, France, Netherlands",
  factors: {
    Political: ["Stable EU regulatory environment", "Risk: digital sovereignty preference for EU vendors"],
    Economic: ["EUR/USD favorable for USD-cost-base", "Industrial output forecast flat-to-down 2026"],
    Social: ["Strong privacy expectations from buyers", "Decentralized buying — multi-stakeholder cycles"],
    Technological: ["Cloud adoption accelerating in mfg.", "Edge / on-prem still common in DACH"],
    Environmental: ["CSRD reporting now mandatory — opportunity to position", "Energy cost volatility post-Ukraine"],
    Legal: ["GDPR + EU AI Act compliance non-negotiable", "Data-residency requirements vary by country"],
  },
  recommendation: "GTM ready for NL/DE; lead with CSRD-aligned features. Block on EU AI Act review and data-residency architecture before signing.",
};

export function getMetrics(d: Pestel) {
  const total = FACTORS.reduce((n, k) => n + d.factors[k].length, 0);
  return [
    { k: "Factors", v: String(total) },
  ];
}
