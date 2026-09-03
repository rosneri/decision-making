import { defineBias } from "../types";

export const bias = defineBias({
  id: "survivorship_bias",
  name: "Survivorship bias",
  family: "pattern",
  blurb: "Learning only from the cases that made it, never from the ones that didn't.",
  description:
    "The people who dropped out and succeeded, the products that launched early and won, the funds with great ten-year records, are all visible because they survived. The far larger group that did the same thing and vanished leaves no trace. Advice and pattern-matching built on survivors overstate the odds badly.",
  cues: [
    "Success stories cited as evidence that a strategy works",
    "'Everyone who did X succeeded' with no count of those who did X and failed",
    "Role models or exemplars used in place of statistics",
  ],
  question: "Who tried this and isn't around to tell me how it went?",
  counters: [
    "For every success example, deliberately find two failures that took the same path.",
    "Ask for the denominator: how many started, not how many finished.",
    "Study the failures directly; they carry more information than the wins.",
  ],
  antidotes: ["reference_class", "pre_mortem", "inversion"],
  source: "Wald 1943; Brown et al. 1992",
});
