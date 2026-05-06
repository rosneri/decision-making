import { z } from "zod";

export const VARS = ["Political", "Military", "Economic", "Social", "Information", "Infrastructure", "Physical", "Time"] as const;
export type Var = (typeof VARS)[number];

export const meta = {
  id: "pmesii_pt",
  name: "PMESII-PT",
  category: "Military & intelligence",
  blurb: "Operational-environment scan: Political · Military · Economic · Social · Info · Infra · Physical · Time.",
} as const;

export const schema = z.object({
  framework: z.literal("pmesii_pt"),
  category: z.string(),
  title: z.string(),
  area: z.string(),
  variables: z.object({
    Political: z.array(z.string()).min(1).max(8),
    Military: z.array(z.string()).min(1).max(8),
    Economic: z.array(z.string()).min(1).max(8),
    Social: z.array(z.string()).min(1).max(8),
    Information: z.array(z.string()).min(1).max(8),
    Infrastructure: z.array(z.string()).min(1).max(8),
    Physical: z.array(z.string()).min(1).max(8),
    Time: z.array(z.string()).min(1).max(8),
  }),
  recommendation: z.string(),
});
export type PmesiiPt = z.infer<typeof schema>;

export const sample: PmesiiPt = {
  framework: "pmesii_pt",
  category: meta.category,
  title: "AOR scan — coastal province",
  area: "Coastal province ahead of humanitarian operation",
  variables: {
    Political: ["Provincial governor recently appointed; weak rapport with capital"],
    Military: ["Two competing militias; one aligned with national army"],
    Economic: ["Fishery + remittances dominant; cash-based economy"],
    Social: ["Three ethnic groups; clan ties strong"],
    Information: ["Cellular reliable in cities; rural via satellite", "Pro-regime radio dominant"],
    Infrastructure: ["Single deep-water port (silting risk)", "One paved highway inland"],
    Physical: ["Mangrove coast; flood season Apr–Jun"],
    Time: ["Operation must conclude before monsoon (mid-May)"],
  },
  recommendation: "Sequence by Time constraint: monsoon caps window. Lead with Information ops in cities, kinetic posture light, route via highway.",
};

export function getMetrics(d: PmesiiPt) {
  const total = VARS.reduce((n, k) => n + d.variables[k].length, 0);
  return [
    { k: "Variables", v: `${VARS.length}` },
    { k: "Notes", v: String(total) },
  ];
}
