import { defineBias } from "../types";

export const bias = defineBias({
  id: "confirmation_bias",
  name: "Confirmation bias",
  family: "pattern",
  blurb: "Seeking and trusting evidence that agrees with what you already believe.",
  description:
    "Once a view forms, we search for support, read ambiguous facts as favourable and hold contrary evidence to a higher standard. The decision then feels well-researched when it has merely been well-defended. It is the most common bias in written decision cases and the hardest to notice from inside.",
  cues: [
    "Evidence cited only on one side of the question",
    "Contrary data explained away or absent",
    "The conclusion stated before the analysis, then supported",
  ],
  question: "What evidence would change my mind, and have I actually looked for it?",
  counters: [
    "Write the strongest case for the option you're rejecting, as its best advocate would.",
    "List what you'd expect to see if you were wrong, then go look for exactly that.",
    "Have someone argue the other side before you finalise.",
  ],
  antidotes: ["ach", "inversion", "six_hats"],
  aka: ["Myside bias", "Semmelweis reflex"],
  source: "Wason 1960; Nickerson 1998",
});
