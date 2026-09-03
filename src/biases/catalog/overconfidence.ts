import { defineBias } from "../types";

export const bias = defineBias({
  id: "overconfidence",
  name: "Overconfidence",
  family: "action",
  blurb: "Being surer of your estimate, skill or knowledge than the evidence allows.",
  description:
    "Confidence intervals we give are far too narrow, and we rate our own abilities above average in almost every domain. In decisions this means treating a guess as a fact, and skipping the step of asking how wrong the estimate could be.",
  cues: [
    "Point estimates stated without ranges or uncertainty ('it will take three months')",
    "Claims of certainty about how other people or markets will respond",
    "Dismissing the need for a test, pilot or second opinion",
  ],
  question: "What is my 90% range on the key number, and would I bet at those odds?",
  counters: [
    "Give every important number a low and a high bound, then widen them by half.",
    "Ask someone with no stake in the outcome to estimate the same thing independently.",
    "Keep a short record of past predictions and check how calibrated you actually are.",
  ],
  antidotes: ["monte_carlo", "reference_class", "bayesian"],
  aka: ["Overprecision", "Dunning–Kruger effect"],
  source: "Moore & Healy 2008",
});
