import { z } from "zod";

export const QUESTIONS = ["intended", "actual", "why", "next"] as const;
export type AarQ = (typeof QUESTIONS)[number];

export const meta = {
  id: "aar",
  name: "After-Action Review",
  category: "Crisis & emergency",
  blurb: "Four questions, blameless: what was supposed to happen, what did, why, and what's next.",
} as const;

export const schema = z.object({
  framework: z.literal("aar"),
  category: z.string(),
  title: z.string(),
  event: z.string(),
  intended: z.string(),
  actual: z.string(),
  why: z.array(z.string()).min(1).max(8),
  next: z.array(z.string()).min(1).max(8),
  recommendation: z.string(),
});
export type Aar = z.infer<typeof schema>;

export const sample: Aar = {
  framework: "aar",
  category: meta.category,
  title: "Saturday outage — what happened?",
  event: "Saturday API outage, 47 min, customer-impacting",
  intended: "Background migration runs in shadow mode for 24h; cutover only after validation green.",
  actual: "Migration cut over after 2h because validator silently passed; primary key collision took DB down 47 min.",
  why: [
    "Validator returned 'OK' even with zero rows compared (default-pass behavior)",
    "Runbook didn't require manual sign-off before cutover",
    "On-call paged 11 min late because PagerDuty escalation policy was wrong",
  ],
  next: [
    "Validator: fail-closed when sample size < threshold",
    "Runbook: human-confirm checkbox before cutover step",
    "PagerDuty: rebuild escalation policy + monthly drill",
  ],
  recommendation: "Three concrete process changes with owners. No individual blame; the system allowed this.",
};

export const META: Record<AarQ, { label: string; q: string }> = {
  intended: { label: "What was supposed to happen?", q: "the plan" },
  actual: { label: "What actually happened?", q: "ground truth" },
  why: { label: "Why did it differ?", q: "blameless" },
  next: { label: "What will we do next time?", q: "concrete actions" },
};

export function getMetrics(d: Aar) {
  return [
    { k: "Causes", v: String(d.why.length) },
    { k: "Actions", v: String(d.next.length) },
  ];
}
