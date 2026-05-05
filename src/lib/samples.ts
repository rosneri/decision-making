import type { FrameworkResult } from "./schemas";

export const SAMPLES: Record<string, FrameworkResult> = {
  decision_matrix: {
    framework: "decision_matrix",
    title: "Choosing a new laptop",
    criteria: [
      { name: "Price", weight: 8 },
      { name: "Performance", weight: 9 },
      { name: "Battery", weight: 6 },
      { name: "Build quality", weight: 5 },
    ],
    options: [
      { name: "MacBook Pro 14", scores: [4, 9, 8, 9] },
      { name: "Dell XPS 15", scores: [6, 8, 6, 7] },
      { name: "ThinkPad X1", scores: [7, 7, 9, 8] },
    ],
    recommendation:
      "Try the sliders — adjust weights based on what matters most to you and the highlighted winner will update.",
  },
  eisenhower: {
    framework: "eisenhower",
    title: "This week's tasks",
    tasks: [
      { text: "Fix production bug", urgent: true, important: true },
      { text: "Plan Q3 roadmap", urgent: false, important: true },
      { text: "Reply to recruiter spam", urgent: true, important: false },
      { text: "Browse Twitter", urgent: false, important: false },
      { text: "1:1 with manager", urgent: false, important: true },
      { text: "Order office snacks", urgent: true, important: false },
    ],
    recommendation:
      "Do the production bug now, schedule deep work on the roadmap, delegate the snack run, and stop scrolling.",
  },
  swot: {
    framework: "swot",
    title: "Launching a side project",
    strengths: ["Strong domain expertise", "Existing audience", "Low overhead"],
    weaknesses: ["Limited time outside day job", "No co-founder"],
    opportunities: ["Growing market", "AI tooling cuts dev time", "No major incumbent"],
    threats: ["Competitors well funded", "Platform policy changes"],
    recommendation:
      "Lean into your audience and ship a thin v1 fast. Keep scope small enough to fit nights/weekends until traction justifies more.",
  },
};
