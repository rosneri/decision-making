import { defineBias } from "../types";

export const bias = defineBias({
  id: "projection_bias",
  name: "Projection bias",
  family: "framing",
  blurb: "Assuming your future self will want what your present self wants.",
  description:
    "Preferences, energy and circumstances change, and we under-predict the change. The decision made while hungry, tired, elated or freshly hurt assumes that state will persist. Long commitments, made in a moment, bind a future person who may see things quite differently. The hot-cold empathy gap is the same effect across emotional states.",
  cues: [
    "A long-term commitment reasoned from a current mood or life stage",
    "Decision made soon after an emotional event",
    "'I'll always want' or 'I'll never want'",
  ],
  question: "Would I make this choice in a different mood, and which mood should get the vote?",
  counters: [
    "Delay irreversible commitments until you've considered them in at least two different states.",
    "Ask how your preferences have changed over the last five years, and assume similar drift ahead.",
    "Prefer options that leave room to adjust as you change.",
  ],
  antidotes: ["odyssey", "stoic", "regret_min"],
  aka: ["Hot–cold empathy gap"],
  source: "Loewenstein, O'Donoghue & Rabin 2003",
});
