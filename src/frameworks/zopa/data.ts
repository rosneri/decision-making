import { z } from "zod";

export const meta = {
  id: "zopa",
  name: "ZOPA",
  category: "Negotiation & conflict",
  blurb: "Zone of Possible Agreement: the overlap between buyer's max and seller's min.",
} as const;

export const schema = z.object({
  framework: z.literal("zopa"),
  category: z.string(),
  title: z.string(),
  buyer: z.object({
    name: z.string(),
    target: z.number(),
    walkaway: z.number(),
  }),
  seller: z.object({
    name: z.string(),
    target: z.number(),
    walkaway: z.number(),
  }),
  unit: z.string(),
  recommendation: z.string(),
});
export type Zopa = z.infer<typeof schema>;

export const sample: Zopa = {
  framework: "zopa",
  category: meta.category,
  title: "Acquihire — engineering team",
  buyer: { name: "Acquirer", target: 1_800_000, walkaway: 2_400_000 },
  seller: { name: "Founders", target: 3_000_000, walkaway: 2_100_000 },
  unit: "$",
  recommendation: "ZOPA: $2.1M – $2.4M. Anchor mid-zone at $2.25M; bring non-cash sweeteners to nudge toward $2.4M.",
};

export function zopa(d: Zopa) {
  // Buyer pays at most walkaway; seller accepts at least walkaway.
  // ZOPA exists when buyer.walkaway >= seller.walkaway.
  const lo = d.seller.walkaway;
  const hi = d.buyer.walkaway;
  const exists = hi >= lo;
  const mid = (lo + hi) / 2;
  return { lo, hi, exists, mid };
}

export function getMetrics(d: Zopa) {
  const z = zopa(d);
  return [
    { k: "ZOPA", v: z.exists ? `${d.unit}${z.lo.toLocaleString()}–${d.unit}${z.hi.toLocaleString()}` : "none" },
    { k: "Anchor", v: z.exists ? `${d.unit}${Math.round(z.mid).toLocaleString()}` : "—" },
  ];
}
