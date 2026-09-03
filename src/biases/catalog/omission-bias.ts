import { defineBias } from "../types";

export const bias = defineBias({
  id: "omission_bias",
  name: "Omission bias",
  family: "stability",
  blurb: "Judging harm from action as worse than equal harm from inaction.",
  description:
    "Doing something that causes harm feels more blameworthy than failing to do something that would have prevented it, even when the outcomes are identical. Decision-makers then avoid the intervention and accept the larger passive harm, because passivity carries less responsibility. Health, safety and policy decisions are classic cases.",
  cues: [
    "Not acting treated as the responsible or safe choice by default",
    "Harm from intervening discussed in detail, harm from not intervening barely mentioned",
    "Concern about being blamed for a choice rather than about outcomes",
  ],
  question: "If both paths cause harm, am I comparing the harms or comparing the blame?",
  counters: [
    "Write the consequences of doing nothing as concretely as the consequences of acting.",
    "Ask how you'd judge someone else who chose inaction here.",
    "Assign responsibility for the outcome of inaction explicitly; it is also a choice.",
  ],
  antidotes: ["cost_benefit", "categorical_imperative", "qaly"],
  source: "Ritov & Baron 1990",
});
