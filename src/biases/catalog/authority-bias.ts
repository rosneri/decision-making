import { defineBias } from "../types";

export const bias = defineBias({
  id: "authority_bias",
  name: "Authority bias",
  family: "social",
  blurb: "Weighting an opinion by the status of who holds it rather than by its merit.",
  description:
    "The boss's preference, the famous investor's tweet, the senior doctor's hunch: status lends arguments a weight that their evidence may not support. In organisations this becomes 'sunflower management', where teams align with the leader's expected view before it's even stated. The expert may well be right; the bias is in not checking.",
  cues: [
    "A senior or well-known person's view cited as decisive",
    "Argument from credentials rather than from evidence",
    "Reluctance to question a recommendation because of who made it",
  ],
  question: "Would I accept this argument if it came from an intern?",
  counters: [
    "Strip the names from the arguments and evaluate them blind.",
    "Ask the authority what evidence they're relying on, and check whether it's within their expertise.",
    "Seek one qualified opinion that disagrees, and take it seriously.",
  ],
  antidotes: ["ach", "grade", "six_hats"],
  aka: ["Sunflower management", "Deference to expertise"],
  source: "Milgram 1963; Lovallo & Sibony 2010",
});
