import { defineBias } from "../types";

export const bias = defineBias({
  id: "illusion_of_control",
  name: "Illusion of control",
  family: "action",
  blurb: "Believing you can steer outcomes that are mostly chance or other people's choices.",
  description:
    "We overrate how much our own effort, skill or attention determines the result, especially when we are involved and the outcome matters. Decisions then lean on 'I'll make it work' where the honest input is 'it depends on things I don't control'.",
  cues: [
    "Success attributed to effort or willpower rather than conditions",
    "Little attention to what other parties, the market or luck will do",
    "'I can manage that' used to dismiss a risk rather than plan for it",
  ],
  question: "Which parts of this outcome are actually in my hands, and which are not?",
  counters: [
    "List the factors that decide the outcome and mark each as controllable, influenceable or neither.",
    "Plan for the uncontrollable ones as scenarios, not as things you'll handle.",
    "Ask what an outsider would say determines success here.",
  ],
  antidotes: ["stoic", "second_order", "monte_carlo"],
  source: "Langer 1975",
});
