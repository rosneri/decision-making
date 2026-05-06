import { z } from "zod";

export const meta = {
  id: "bias_checklist",
  name: "Cognitive Bias Checklist",
  category: "Cognitive & behavioral",
  blurb: "Pause System 1. Run the decision through the most common ways minds mislead.",
} as const;

export const schema = z.object({
  framework: z.literal("bias_checklist"),
  category: z.string(),
  title: z.string(),
  decision: z.string(),
  biases: z.array(z.object({
    name: z.string(),
    question: z.string(),
    triggered: z.boolean(),
    note: z.string(),
  })).min(4).max(20),
  recommendation: z.string(),
});
export type BiasChecklist = z.infer<typeof schema>;

export const sample: BiasChecklist = {
  framework: "bias_checklist",
  category: meta.category,
  title: "Should we double down on our struggling B2B feature?",
  decision: "Continue investing engineering on Feature X despite low usage",
  biases: [
    { name: "Confirmation bias", question: "Am I weighing only evidence that supports my view?", triggered: true, note: "I cite the 3 happy customers, ignore the 47 dormant ones" },
    { name: "Sunk-cost fallacy", question: "Am I continuing because of past investment?", triggered: true, note: "We've spent 6 months — feels expensive to kill" },
    { name: "Availability heuristic", question: "Am I overweighting recent/vivid examples?", triggered: false, note: "" },
    { name: "Anchoring", question: "Am I anchored on an initial number or framing?", triggered: false, note: "" },
    { name: "Optimism bias", question: "Is my forecast better than base rates?", triggered: true, note: "Projecting 3x growth with no comparable" },
    { name: "Groupthink", question: "Did dissent get aired?", triggered: false, note: "engineering pushed back hard" },
  ],
  recommendation: "3 biases triggered, all pointing the same way. Revisit the kill decision with fresh eyes and base rates.",
};

export function getMetrics(d: BiasChecklist) {
  const hits = d.biases.filter((b) => b.triggered).length;
  return [
    { k: "Triggered", v: `${hits}/${d.biases.length}` },
    { k: "Risk", v: hits >= 3 ? "high" : hits >= 1 ? "medium" : "low" },
  ];
}
