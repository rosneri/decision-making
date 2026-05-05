import { z } from "zod";


export const STAGES = ["observe", "orient", "decide", "act"] as const;
export type Stage = (typeof STAGES)[number];

export const meta = {
  id: "ooda",
  name: "OODA Loop",
  category: "Military & intelligence",
  blurb: "Observe, Orient, Decide, Act — faster than the adversary wins.",
} as const;

export const schema = z.object({
  framework: z.literal("ooda"),
  category: z.string(),
  title: z.string(),
  notes: z.object({
    observe: z.string(),
    orient: z.string(),
    decide: z.string(),
    act: z.string(),
  }),
  current: z.enum(STAGES),
  recommendation: z.string(),
});
export type Ooda = z.infer<typeof schema>;

export const sample: Ooda = {
  framework: "ooda",
  category: meta.category,
  title: "Competitor just dropped a clone of our flagship.",
  notes: {
    observe: "competitor shipped, 8% of our trial signups now mention it",
    orient: "they undercut on price; quality unknown",
    decide: "",
    act: "",
  },
  current: "orient",
  recommendation: "Get more signal: ship a deep comparison page in 48h. Then decide on price vs. positioning move.",
};

export const STAGE_META: Record<Stage, { letter: string; label: string; note: string }> = {
  observe: { letter: "O", label: "Observe", note: "what just changed?" },
  orient: { letter: "O", label: "Orient", note: "what does it mean?" },
  decide: { letter: "D", label: "Decide", note: "pick the move" },
  act: { letter: "A", label: "Act", note: "ship the response" },
};
