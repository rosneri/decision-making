import { z } from "zod";


export const MODES = ["compete", "collaborate", "compromise", "avoid", "accommodate"] as const;
export type Mode = (typeof MODES)[number];

export const meta = {
  id: "tki",
  name: "Thomas-Kilmann Modes",
  category: "Negotiation & conflict",
  blurb: "Five conflict modes plotted on assertiveness × cooperativeness.",
} as const;

export const schema = z.object({
  framework: z.literal("tki"),
  category: z.string(),
  title: z.string(),
  assertiveness: z.number().min(0).max(10),
  cooperativeness: z.number().min(0).max(10),
  recommendation: z.string(),
});
export type Tki = z.infer<typeof schema>;

export const sample: Tki = {
  framework: "tki",
  category: meta.category,
  title: "Coworker keeps overriding my decisions in meetings.",
  assertiveness: 8,
  cooperativeness: 8,
  recommendation: "High stakes + ongoing relationship → collaborate. Schedule a 1:1, name the pattern, propose a joint protocol.",
};

export const ANCHORS: Record<Mode, { x: number; y: number; sub: string }> = {
  compete: { x: 1, y: 9, sub: "I win" },
  collaborate: { x: 9, y: 9, sub: "we both win" },
  compromise: { x: 5, y: 5, sub: "split" },
  avoid: { x: 1, y: 1, sub: "skip it" },
  accommodate: { x: 9, y: 1, sub: "you win" },
};

export const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y);

export function getMetrics(d: Tki) {
  const point = { x: d.cooperativeness, y: d.assertiveness };
  const entries = Object.entries(ANCHORS) as [Mode, { x: number; y: number; sub: string }][];
  const closest = entries.reduce((b, e) => (dist(point, e[1]) < dist(point, b[1]) ? e : b), entries[0]!);
  return [{ k: "Mode", v: closest[0] }];
}
