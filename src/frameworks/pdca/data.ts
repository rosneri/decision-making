import { z } from "zod";


export const PHASES = ["P", "D", "C", "A"] as const;
export type Phase = (typeof PHASES)[number];

export const meta = {
  id: "pdca",
  name: "PDCA Cycle",
  category: "Operations & quality",
  blurb: "Plan, Do, Check, Act — small loops that compound improvement.",
} as const;

export const schema = z.object({
  framework: z.literal("pdca"),
  category: z.string(),
  title: z.string(),
  cycleNumber: z.number().int().min(1),
  phases: z.object({
    P: z.string(), D: z.string(), C: z.string(), A: z.string(),
  }),
  current: z.enum(PHASES),
  recommendation: z.string(),
});
export type Pdca = z.infer<typeof schema>;

export const sample: Pdca = {
  framework: "pdca",
  category: meta.category,
  title: "Bug rate keeps climbing. Where do we start?",
  cycleNumber: 3,
  phases: {
    P: "hypothesis: tests miss async edge cases",
    D: "added 12 contract tests on top async paths",
    C: "still seeing 38% of bugs in async code",
    A: "adopt: contract tests; adjust: add chaos test next cycle",
  },
  current: "A",
  recommendation: "Take the 'A' lesson into cycle 4: chaos-testing async paths is the next experiment.",
};

export const META: Record<Phase, { word: string; note: string }> = {
  P: { word: "Plan", note: "hypothesis" },
  D: { word: "Do", note: "small test" },
  C: { word: "Check", note: "measure" },
  A: { word: "Act", note: "adopt or adjust" },
};

export function getMetrics(d: Pdca) {
  return [
    { k: "Cycle", v: `#${d.cycleNumber}` },
    { k: "Phase", v: META[d.current].word },
  ];
}
