import { z } from "zod";


export const COND = ["capability", "credibility", "communication"] as const;
export type Cond = (typeof COND)[number];

export const meta = {
  id: "deterrence",
  name: "Deterrence",
  category: "Diplomatic & geopolitical",
  blurb: "Capability, credibility, communication — all three required, or the threat fails.",
} as const;

export const schema = z.object({
  framework: z.literal("deterrence"),
  category: z.string(),
  title: z.string(),
  conditions: z.object({
    capability: z.object({ state: z.enum(["yes", "weak", "no"]), note: z.string() }),
    credibility: z.object({ state: z.enum(["yes", "weak", "no"]), note: z.string() }),
    communication: z.object({ state: z.enum(["yes", "weak", "no"]), note: z.string() }),
  }),
  recommendation: z.string(),
});
export type Deterrence = z.infer<typeof schema>;

export const sample: Deterrence = {
  framework: "deterrence",
  category: meta.category,
  title: "Will the threat actually deter the rival?",
  conditions: {
    capability: { state: "yes", note: "we can retaliate" },
    credibility: { state: "weak", note: "past inaction has broken the signal" },
    communication: { state: "yes", note: "they got the message" },
  },
  recommendation: "Credibility is the weak link. Deterrence will fail until past inaction is repaired with a smaller, visible commitment.",
};

export const META: Record<Cond, { label: string; q: string }> = {
  capability: { label: "Capability", q: "can we actually retaliate?" },
  credibility: { label: "Credibility", q: "do they believe we will?" },
  communication: { label: "Communication", q: "did they get the signal?" },
};

export const cycleState = (v: "yes" | "weak" | "no"): "yes" | "weak" | "no" =>
  v === "yes" ? "weak" : v === "weak" ? "no" : "yes";

export function getMetrics(d: Deterrence) {
  const score = (s: "yes" | "weak" | "no") => s === "yes" ? 2 : s === "weak" ? 1 : 0;
  const entries = (Object.entries(d.conditions) as [Cond, { state: "yes" | "weak" | "no"; note: string }][]);
  const weak = entries.reduce((b, e) => (score(e[1].state) < score(b[1].state) ? e : b), entries[0]!);
  const allYes = entries.every((e) => e[1].state === "yes");
  return [
    { k: "Verdict", v: allYes ? "Holds" : "Fails" },
    { k: "Weak link", v: META[weak[0]].label },
  ];
}
