import { defineBias } from "../types";

export const bias = defineBias({
  id: "self_serving_bias",
  name: "Self-serving bias",
  family: "interest",
  blurb: "Judging the option that benefits you as the one that's right.",
  description:
    "Incentives, status and comfort shape what looks reasonable long before conscious reasoning starts. The choice that pays you, protects your team or flatters your record tends to arrive dressed as the objective answer. This is motivated reasoning, and nobody is exempt from it.",
  cues: [
    "The recommended option is also the one that benefits the decider most",
    "Arguments for the preferred option are elaborate; arguments against are thin",
    "Incentives, bonuses, reputation or ego are at stake but not mentioned",
  ],
  question: "Would I reach the same conclusion if I had nothing to gain or lose from it?",
  counters: [
    "Write down what you personally gain from each option before evaluating them.",
    "Ask someone with opposite incentives to make the case against your preference.",
    "Decide the criteria first, with a colleague, before looking at which option wins.",
  ],
  antidotes: ["veil_of_ignorance", "decision_matrix", "markkula"],
  aka: ["Motivated reasoning", "Misaligned incentives"],
  source: "Kunda 1990; Kahneman, Lovallo & Sibony 2011",
});
