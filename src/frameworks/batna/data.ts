import { z } from "zod";


export const meta = {
  id: "batna",
  name: "BATNA / ZOPA",
  category: "Game theory & negotiation",
  blurb: "Best alternative on each side defines the zone where a deal exists.",
} as const;

export const schema = z.object({
  framework: z.literal("batna"),
  category: z.string(),
  title: z.string(),
  unit: z.string(),
  yourBatna: z.object({ label: z.string(), value: z.number() }),
  theirBatna: z.object({ label: z.string(), value: z.number() }),
  yourTarget: z.number(),
  yourAnchor: z.number(),
  recommendation: z.string(),
});
export type Batna = z.infer<typeof schema>;

export const sample: Batna = {
  framework: "batna",
  category: meta.category,
  title: "Salary negotiation — what's my walkaway?",
  unit: "$k",
  yourBatna: { label: "stay at current job", value: 145 },
  theirBatna: { label: "hire 2nd choice", value: 180 },
  yourTarget: 170,
  yourAnchor: 185,
  recommendation: "Anchor at 185, target 170. Below 145, walk; above 180, they walk.",
};

export function getMetrics(d: Batna) {
  const zopa = Math.max(0, d.theirBatna.value - d.yourBatna.value);
  return [
    { k: "Walkaway", v: `${d.unit}${d.yourBatna.value}` },
    { k: "Their walkaway", v: `${d.unit}${d.theirBatna.value}` },
    { k: "ZOPA", v: zopa > 0 ? `${d.unit}${zopa}` : "none" },
  ];
}
