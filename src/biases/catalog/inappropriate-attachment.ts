import { defineBias } from "../types";

export const bias = defineBias({
  id: "inappropriate_attachment",
  name: "Inappropriate attachment",
  family: "interest",
  blurb: "Emotional loyalty to a person, project or place outweighing its merits.",
  description:
    "We grow fond of the things we built, the people we hired and the places we've lived, and that fondness leaks into evaluation. The legacy product gets one more year, the struggling hire one more chance, the city one more lease, because leaving feels like betrayal rather than because the numbers say stay.",
  cues: [
    "Language of loyalty, identity or 'my baby' about an option",
    "A person, team or product defended beyond what its results justify",
    "Discomfort at the idea of letting go mentioned as a reason to continue",
  ],
  question: "If a stranger owned this, would I advise them to keep it?",
  counters: [
    "Evaluate the option as if it belonged to someone else and you were the outside adviser.",
    "Separate the decision about the thing from the decision about the people; each can be handled kindly.",
    "Set the criteria for continuing in advance, then judge against them.",
  ],
  antidotes: ["sunk_cost", "inversion", "stoic"],
  source: "Lovallo & Sibony 2010",
});
