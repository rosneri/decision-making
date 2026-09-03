import { defineBias } from "../types";

export const bias = defineBias({
  id: "ingroup_bias",
  name: "In-group bias",
  family: "social",
  blurb: "Favouring your own team, tribe or tradition over outsiders on the same evidence.",
  description:
    "Ideas from our side get the benefit of the doubt; the same ideas from elsewhere get scrutiny. This includes not-invented-here, where solutions built outside are rejected in favour of building your own, and loyalty to alma maters, former colleagues and familiar vendors. It feels like judgement and is mostly membership.",
  cues: [
    "Preference for an internal, familiar or affiliated option without a merit comparison",
    "Outside solutions dismissed before evaluation",
    "'Our people', 'our way', 'people like us'",
  ],
  question: "Would I rate this the same if it came from the other group?",
  counters: [
    "Evaluate options with the source hidden, on written criteria.",
    "Deliberately include one outsider option and give it a fair hearing.",
    "Ask what the out-group knows that you don't.",
  ],
  antidotes: ["veil_of_ignorance", "decision_matrix", "pugh"],
  aka: ["Not-invented-here", "Affinity bias"],
  source: "Tajfel 1970",
});
