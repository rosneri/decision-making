import { z } from "zod";


export const meta = {
  id: "first_principles",
  name: "First Principles",
  category: "Mental models",
  blurb: "Strip an assumption down to what's actually true, then rebuild.",
} as const;

export const schema = z.object({
  framework: z.literal("first_principles"),
  category: z.string(),
  title: z.string(),
  assumption: z.string(),
  questions: z.array(z.object({ q: z.string(), answer: z.string() })).min(1).max(6),
  truths: z.array(z.string()).min(1).max(6),
  recommendation: z.string(),
});
export type FirstPrinciples = z.infer<typeof schema>;

export const sample: FirstPrinciples = {
  framework: "first_principles",
  category: meta.category,
  title: "Why does our onboarding take six weeks?",
  assumption: "New hires need 6 weeks of training",
  questions: [
    { q: "What's actually true?", answer: "Most ramp time is spent waiting on env access" },
    { q: "What can be measured?", answer: "Time-to-first-PR averages 18 days" },
    { q: "What if we removed it?", answer: "Self-serve onboarding cuts week one to a day" },
  ],
  truths: ["env access is the real bottleneck", "shadowing > slides", "context lives in code, not docs"],
  recommendation: "Replace the 6-week curriculum with a self-serve env + a buddy. Measure time-to-first-PR weekly.",
};

export function getMetrics(d: FirstPrinciples) {
  return [
    { k: "Truths", v: String(d.truths.length) },
    { k: "Questions", v: String(d.questions.length) },
  ];
}
