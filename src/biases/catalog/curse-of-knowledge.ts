import { defineBias } from "../types";

export const bias = defineBias({
  id: "curse_of_knowledge",
  name: "Curse of knowledge",
  family: "pattern",
  blurb: "Forgetting that others don't know what you know.",
  description:
    "Once you understand something, it becomes hard to imagine not understanding it. Decisions about communication, onboarding, pricing, product design and delegation then assume a level of context the audience doesn't have. The plan is clear to its author and opaque to everyone it depends on.",
  cues: [
    "Plans that rely on customers, staff or partners 'getting it' without explanation",
    "Frustration that others don't see what seems obvious",
    "Expert shorthand used where a newcomer would be lost",
  ],
  question: "What would this look like to someone hearing it for the first time?",
  counters: [
    "Test the message or product on someone with no context and watch where they stumble.",
    "Write the explanation a beginner would need, then judge whether the plan survives it.",
    "Ask a newcomer to repeat the plan back to you in their own words.",
  ],
  antidotes: ["design_thinking", "jtbd", "structured_interview"],
  source: "Camerer, Loewenstein & Weber 1989",
});
