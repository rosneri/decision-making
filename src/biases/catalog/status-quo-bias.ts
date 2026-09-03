import { defineBias } from "../types";

export const bias = defineBias({
  id: "status_quo_bias",
  name: "Status quo bias",
  family: "stability",
  blurb: "Treating the current state as the default that needs no justification.",
  description:
    "Staying put feels like not deciding, so it escapes the scrutiny the alternatives get. The present arrangement is compared on its familiar strengths while the alternatives are compared on their unknown risks. Any option you'd have to actively choose is held to a higher bar than the one you drift into.",
  cues: [
    "The current situation not evaluated as an option with its own costs",
    "Change described in terms of risk, staying in terms of safety",
    "'Why rock the boat' or 'it's working well enough'",
  ],
  question: "If I weren't already here, would I choose to be?",
  counters: [
    "Put 'keep things as they are' on the list and score it on the same criteria as the rest.",
    "Ask what you'd need to see to move from the alternative back to the status quo.",
    "Name the cost of staying, including what you forgo.",
  ],
  antidotes: ["inversion", "decision_matrix", "regret_min"],
  source: "Samuelson & Zeckhauser 1988",
});
