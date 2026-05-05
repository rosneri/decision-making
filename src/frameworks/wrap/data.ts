import { z } from "zod";


export const STEPS = ["W", "R", "A", "P"] as const;
export type Step = (typeof STEPS)[number];

export const meta = {
  id: "wrap",
  name: "WRAP Process",
  category: "Cognitive & behavioral",
  blurb: "Widen options, Reality-test, Attain distance, Prepare to be wrong.",
} as const;

export const schema = z.object({
  framework: z.literal("wrap"),
  category: z.string(),
  title: z.string(),
  steps: z.object({
    W: z.object({ done: z.boolean(), notes: z.string() }),
    R: z.object({ done: z.boolean(), notes: z.string() }),
    A: z.object({ done: z.boolean(), notes: z.string() }),
    P: z.object({ done: z.boolean(), notes: z.string() }),
  }),
  current: z.enum(STEPS),
  recommendation: z.string(),
});
export type Wrap = z.infer<typeof schema>;

export const sample: Wrap = {
  framework: "wrap",
  category: meta.category,
  title: "Should I leave my marriage?",
  steps: {
    W: { done: true, notes: "considered counseling, separation, status quo" },
    R: { done: true, notes: "tested two months apart" },
    A: { done: false, notes: "" },
    P: { done: false, notes: "" },
  },
  current: "A",
  recommendation: "You're at Attain distance — write the letter to your future self before deciding.",
};

export const META: Record<Step, { word: string; desc: string }> = {
  W: { word: "Widen", desc: "find more options" },
  R: { word: "Reality-test", desc: "stress your assumptions" },
  A: { word: "Attain distance", desc: "view from a friend's seat" },
  P: { word: "Prepare to be wrong", desc: "tripwires + pre-mortem" },
};
