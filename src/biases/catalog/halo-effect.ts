import { defineBias } from "../types";

export const bias = defineBias({
  id: "halo_effect",
  name: "Halo effect",
  family: "pattern",
  blurb: "Letting one strong impression colour every other judgement about the same thing.",
  description:
    "A charismatic founder makes the business model look sounder; a polished deck makes the numbers look firmer; one great reference makes the other references sound better. Traits that have nothing to do with each other get pulled into line by a single overall feeling.",
  cues: [
    "One salient quality (brand, pedigree, charisma, design) mentioned as evidence for unrelated qualities",
    "All attributes of an option rated high or all rated low, with little variation",
    "Reputation doing the work of verification",
  ],
  question: "Am I judging each quality on its own evidence, or borrowing from the overall impression?",
  counters: [
    "Score each criterion independently, ideally before forming an overall view.",
    "Assess the least-visible attributes first, before the impressive ones.",
    "Ask what you'd conclude about the weak attributes if the strong ones weren't there.",
  ],
  antidotes: ["structured_interview", "scorecard", "decision_matrix"],
  source: "Thorndike 1920; Rosenzweig 2007",
});
