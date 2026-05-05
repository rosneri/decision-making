import { z } from "zod";


export const meta = {
  id: "rpd",
  name: "Recognition-Primed",
  category: "Crisis & emergency",
  blurb: "Match to a known pattern, mentally simulate the first workable course, execute.",
} as const;

export const schema = z.object({
  framework: z.literal("rpd"),
  category: z.string(),
  title: z.string(),
  pattern: z.string(),
  course: z.string(),
  checks: z.array(z.object({
    item: z.string(),
    state: z.enum(["yes", "no", "unknown"]),
  })).min(1).max(20),
  recommendation: z.string(),
});
export type Rpd = z.infer<typeof schema>;

export const sample: Rpd = {
  framework: "rpd",
  category: meta.category,
  title: "Engine fire. 90 seconds to call it.",
  pattern: "this looks like the 2019 fire on flight 47",
  course: "divert to KSAN — closest field with rescue, 14 min to ground",
  checks: [
    { item: "runway long enough", state: "yes" },
    { item: "fuel margin OK", state: "yes" },
    { item: "crosswind 22kt", state: "unknown" },
  ],
  recommendation: "All blocking checks are green or marginal. Execute.",
};

export const cycleState = (v: "yes" | "no" | "unknown"): "yes" | "no" | "unknown" =>
  v === "yes" ? "no" : v === "no" ? "unknown" : "yes";
