import { defineBias } from "../types";

export const bias = defineBias({
  id: "choice_overload",
  name: "Choice overload",
  family: "framing",
  blurb: "Deciding worse, or not at all, because there are too many options.",
  description:
    "Beyond a handful of alternatives, comparison quality falls, satisfaction with the eventual choice drops, and the likeliest outcome is deferral. The decision then either stalls or collapses onto whichever option was easiest to evaluate, which is rarely the best one. Wide option sets feel thorough and act as a brake.",
  cues: [
    "A long list of options with no shortlisting step",
    "Fatigue, indecision or repeated postponement mentioned",
    "Options compared on whatever attribute is easiest to see",
  ],
  question: "Which three options would I keep if I had to choose today?",
  counters: [
    "Cut to a shortlist of three to five using one or two must-have criteria, then compare properly.",
    "Decide the criteria before looking at the options, not after.",
    "Accept 'good enough' on the criteria that don't matter much.",
  ],
  antidotes: ["moscow", "decision_matrix", "eisenhower"],
  aka: ["Paradox of choice"],
  source: "Iyengar & Lepper 2000; Schwartz 2004",
});
