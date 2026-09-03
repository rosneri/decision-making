import { defineBias } from "../types";

export const bias = defineBias({
  id: "zero_risk_bias",
  name: "Zero-risk bias",
  family: "framing",
  blurb: "Overpaying to remove a risk completely rather than reduce a bigger one.",
  description:
    "Cutting a risk from 5% to 0% feels far more valuable than cutting another from 50% to 30%, though the second saves more. Certainty has a special glow. Budgets and attention go to eliminating small risks entirely while large ones are left partly addressed.",
  cues: [
    "Preference for the option that eliminates a risk 'completely'",
    "Disproportionate spend on a small risk while a large one remains",
    "'I just want to be sure' as the deciding factor",
  ],
  question: "Am I buying safety, or buying the feeling of certainty?",
  counters: [
    "Compare options by how much total expected harm they remove, not by whether any risk reaches zero.",
    "List all the risks with rough probabilities and see where the money is actually going.",
    "Ask what the certainty costs and what that money would reduce elsewhere.",
  ],
  antidotes: ["fmea", "cost_benefit", "learned_hand"],
  aka: ["Certainty effect"],
  source: "Kahneman & Tversky 1979; Baron 1993",
});
