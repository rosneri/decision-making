import { defineBias } from "../types";

export const bias = defineBias({
  id: "loss_aversion",
  name: "Loss aversion",
  family: "stability",
  blurb: "Feeling a loss about twice as strongly as an equal gain.",
  description:
    "Giving something up hurts more than getting the same thing helps, so choices that risk any loss are avoided even when the expected outcome is clearly positive. Whether something counts as a loss depends on the reference point, which is why the same choice can look like a gamble or a bargain depending on how it's described.",
  cues: [
    "A potential loss discussed at length while a larger potential gain gets a line",
    "Refusing a favourable bet because it could go wrong",
    "Stated fear of losing what has been achieved",
  ],
  question: "Am I avoiding this because it's a bad bet, or because it could lose?",
  counters: [
    "Write the expected value of each option and see whether the numbers agree with the feeling.",
    "Reframe: what do you lose by not taking the option?",
    "Consider the choice as one of many similar choices over a lifetime, not as a one-off.",
  ],
  antidotes: ["cost_benefit", "regret_min", "kelly"],
  source: "Kahneman & Tversky 1979",
});
