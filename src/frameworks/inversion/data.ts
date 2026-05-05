import { z } from "zod";


export const meta = {
  id: "inversion",
  name: "Inversion",
  category: "Mental models",
  blurb: "Stop asking how to succeed. Ask how this fails — then avoid that.",
} as const;

export const schema = z.object({
  framework: z.literal("inversion"),
  category: z.string(),
  title: z.string(),
  forwardGoal: z.string(),
  failureModes: z.array(z.string()).min(1).max(10),
  recommendation: z.string(),
});
export type Inversion = z.infer<typeof schema>;

export const sample: Inversion = {
  framework: "inversion",
  category: meta.category,
  title: "How do I make this product launch succeed?",
  forwardGoal: "Make the launch a success",
  failureModes: ["pricing too high", "wrong audience", "onboarding slips", "support overwhelmed"],
  recommendation: "Pre-empt each failure mode: anchor pricing to a known band, run a 50-customer beta, and staff support up by 2× for week one.",
};

export function getMetrics(d: Inversion) {
  return [
    { k: "Failure modes", v: String(d.failureModes.length) },
  ];
}
