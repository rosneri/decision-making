import { defineBias } from "../types";

export const bias = defineBias({
  id: "anchoring",
  name: "Anchoring",
  family: "stability",
  blurb: "Letting the first number or framing you met drag every later estimate toward it.",
  description:
    "An opening offer, last year's budget, a listed price or a colleague's guess becomes the reference point, and adjustments away from it are almost always too small. The anchor need not be relevant, or even sensible, to work. Negotiations, valuations and forecasts are where it bites hardest.",
  cues: [
    "Estimates expressed as adjustments from a starting figure ('a bit more than last year')",
    "An early number from one party that later numbers cluster around",
    "A target or asking price accepted as the baseline",
  ],
  question: "Where did my starting number come from, and would I choose it from scratch?",
  counters: [
    "Build the estimate from zero using your own inputs before looking at anyone else's figure.",
    "Generate a deliberately opposite anchor and see how far the estimate moves.",
    "In negotiations, set your own reference points before hearing theirs.",
  ],
  antidotes: ["first_principles", "batna", "zopa"],
  source: "Tversky & Kahneman 1974",
});
