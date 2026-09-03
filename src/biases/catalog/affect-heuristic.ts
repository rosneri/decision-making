import { defineBias } from "../types";

export const bias = defineBias({
  id: "affect_heuristic",
  name: "Affect heuristic",
  family: "interest",
  blurb: "Letting how an option feels stand in for how good it is.",
  description:
    "A quick emotional read, liking or dread, does the work that analysis should. Options we like get rated low-risk and high-benefit at once; options we dislike get the reverse, though risk and benefit are usually separate questions. Excitement about a new job or disgust at a competitor quietly rewrites the evidence.",
  cues: [
    "Strong emotional language ('love', 'hate', 'dread', 'excited') attached to options",
    "Risk and benefit of the same option moving together rather than traded off",
    "Gut feeling given as the main reason",
  ],
  question: "Am I rating this option, or rating how it makes me feel?",
  counters: [
    "Score risk and benefit separately, on separate days if you can.",
    "Describe the option in flat, neutral words and see if the ranking holds.",
    "Ask what you'd think of it if it came from someone you dislike.",
  ],
  antidotes: ["six_hats", "decision_matrix", "cost_benefit"],
  source: "Slovic et al. 2002",
});
