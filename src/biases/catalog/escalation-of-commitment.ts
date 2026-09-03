import { defineBias } from "../types";

export const bias = defineBias({
  id: "escalation_of_commitment",
  name: "Escalation of commitment",
  family: "stability",
  blurb: "Doubling down on a failing course to justify the earlier choice.",
  description:
    "When a decision starts going badly, the person who made it tends to invest more, not less, to prove it was right. It combines sunk cost with reputation: reversing course would admit error in public. The result is a good-money-after-bad spiral that outsiders see long before insiders do.",
  cues: [
    "Repeated further investment in something that has missed its targets",
    "The original decision-maker still in charge of the continue-or-stop call",
    "Reversal framed as admitting failure",
  ],
  question: "Would a new person taking over today continue this?",
  counters: [
    "Have someone who did not make the original decision review whether to continue.",
    "Fix a tripwire in advance: if metric X isn't met by date Y, the default is stop.",
    "Separate 'was the original choice reasonable' from 'should we continue now'.",
  ],
  antidotes: ["sunk_cost", "pre_mortem", "aar"],
  source: "Staw 1976",
});
