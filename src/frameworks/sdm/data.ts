import { z } from "zod";


export const meta = {
  id: "sdm",
  name: "Shared Decision-Making",
  category: "Medical & clinical",
  blurb: "Compare options on outcomes the patient actually cares about.",
} as const;

export const schema = z.object({
  framework: z.literal("sdm"),
  category: z.string(),
  title: z.string(),
  patientPriority: z.string(),
  options: z.array(z.object({
    name: z.string(),
    survivalPct: z.number().min(0).max(100),
    qualityOfLife: z.number().int().min(0).max(5),
    burden: z.number().int().min(0).max(5),
  })).min(1).max(8),
  recommendation: z.string(),
});
export type Sdm = z.infer<typeof schema>;

export const sample: Sdm = {
  framework: "sdm",
  category: meta.category,
  title: "Stage I prostate cancer · 64yo · active",
  patientPriority: "keep my running",
  options: [
    { name: "Active surveillance", survivalPct: 99, qualityOfLife: 5, burden: 1 },
    { name: "Surgery (RP)", survivalPct: 97, qualityOfLife: 3, burden: 4 },
    { name: "Radiation", survivalPct: 96, qualityOfLife: 3, burden: 3 },
    { name: "Hormone therapy", survivalPct: 92, qualityOfLife: 2, burden: 2 },
  ],
  recommendation: "Given priority on staying active, surveillance preserves QoL with minimal survival trade-off.",
};

export function getMetrics(d: Sdm) {
  const scored = d.options.map((o) => ({ ...o, fit: o.qualityOfLife - o.burden + o.survivalPct / 25 }));
  const best = scored.reduce((b, o) => (o.fit > b.fit ? o : b), scored[0]!);
  return [
    { k: "Best fit", v: best.name },
    { k: "Survival", v: `${best.survivalPct}%` },
  ];
}
