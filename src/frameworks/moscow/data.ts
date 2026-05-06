import { z } from "zod";

export const BUCKETS = ["must", "should", "could", "wont"] as const;
export type Bucket = (typeof BUCKETS)[number];

export const meta = {
  id: "moscow",
  name: "MoSCoW",
  category: "Product & UX",
  blurb: "Must · Should · Could · Won't. Force a budget on what ships in the release.",
} as const;

export const schema = z.object({
  framework: z.literal("moscow"),
  category: z.string(),
  title: z.string(),
  release: z.string(),
  items: z.array(z.object({
    name: z.string(),
    bucket: z.enum(BUCKETS),
  })).min(3).max(40),
  recommendation: z.string(),
});
export type Moscow = z.infer<typeof schema>;

export const sample: Moscow = {
  framework: "moscow",
  category: meta.category,
  title: "v1.0 launch scope",
  release: "v1.0 — public launch (eight weeks)",
  items: [
    { name: "Sign-up & login", bucket: "must" },
    { name: "Stripe checkout", bucket: "must" },
    { name: "Onboarding flow", bucket: "must" },
    { name: "Email notifications", bucket: "should" },
    { name: "In-app help center", bucket: "should" },
    { name: "Slack integration", bucket: "could" },
    { name: "Mobile app", bucket: "wont" },
    { name: "SOC2 Type II", bucket: "wont" },
  ],
  recommendation: "Musts cover the buy-and-use loop. Hold Slack as an MVP-stretch reward; mobile is a v2 conversation.",
};

export const META: Record<Bucket, { word: string; note: string }> = {
  must: { word: "Must", note: "non-negotiable; release fails without it" },
  should: { word: "Should", note: "important but ship-able if absent" },
  could: { word: "Could", note: "nice-to-have if time permits" },
  wont: { word: "Won't (this time)", note: "explicitly out of scope" },
};

export function getMetrics(d: Moscow) {
  const counts: Record<Bucket, number> = { must: 0, should: 0, could: 0, wont: 0 };
  d.items.forEach((i) => { counts[i.bucket]++; });
  return [
    { k: "Must", v: String(counts.must) },
    { k: "Won't", v: String(counts.wont) },
  ];
}
