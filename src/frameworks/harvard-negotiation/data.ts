import { z } from "zod";


export const meta = {
  id: "harvard_negotiation",
  name: "Principled Negotiation",
  category: "Negotiation & conflict",
  blurb: "Separate people from problem; focus on interests; invent options; insist on objective criteria.",
} as const;

export const schema = z.object({
  framework: z.literal("harvard_negotiation"),
  category: z.string(),
  title: z.string(),
  positions: z.array(z.string()).min(0).max(10),
  interests: z.array(z.string()).min(0).max(10),
  options: z.array(z.string()).min(0).max(10),
  criteria: z.array(z.string()).min(0).max(10),
  recommendation: z.string(),
});
export type Harvard = z.infer<typeof schema>;

export const sample: Harvard = {
  framework: "harvard_negotiation",
  category: meta.category,
  title: "Tenant wants to break the lease — what's the deal?",
  positions: ["I want out, no penalty", "you owe 6 months rent"],
  interests: ["moving for a job", "need to refill quickly"],
  options: ["tenant helps find replacement → 1 month penalty + deposit refund"],
  criteria: ["local market vacancy rate", "comparable lease-break clauses"],
  recommendation: "Move from positions to interests first. The replacement-finder option satisfies both interests at fair cost.",
};

export type Section = "positions" | "interests" | "options" | "criteria";

export const META: Record<Section, { label: string; sub: string; accent: boolean }> = {
  positions: { label: "Positions", sub: "what they say", accent: false },
  interests: { label: "Interests", sub: "why they say it", accent: true },
  options: { label: "Options", sub: "mutual gain ideas", accent: true },
  criteria: { label: "Objective criteria", sub: "external standards", accent: false },
};

export function getMetrics(d: Harvard) {
  return [
    { k: "Interests", v: String(d.interests.length) },
    { k: "Options", v: String(d.options.length) },
    { k: "Criteria", v: String(d.criteria.length) },
  ];
}
