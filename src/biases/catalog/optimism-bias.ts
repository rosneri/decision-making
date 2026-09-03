import { defineBias } from "../types";

export const bias = defineBias({
  id: "optimism_bias",
  name: "Optimism bias",
  family: "action",
  blurb: "Expecting the favourable outcome more often than the record supports.",
  description:
    "People systematically expect things to go better for them than for others in the same position. In a decision it shows up as forecasts that quietly assume the best case, and as a plan with no line for what happens if it doesn't work.",
  cues: [
    "Projections that are all upside with no downside scenario described",
    "Phrases like 'it should be fine', 'I'm sure it will work out', 'worst case we just…'",
    "No mention of how similar attempts by others have gone",
  ],
  question: "If ten people like me tried this, how many would get the outcome I'm picturing?",
  counters: [
    "Write the base case, the bad case and the likely case, and give each a rough probability.",
    "Find three comparable attempts and note how they actually turned out.",
    "Ask what would need to be true for the pessimist in the room to be right.",
  ],
  antidotes: ["pre_mortem", "reference_class", "monte_carlo"],
  aka: ["Wishful thinking"],
  source: "Weinstein 1980; Sharot 2011",
});
