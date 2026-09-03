import { defineBias } from "../types";

export const bias = defineBias({
  id: "small_numbers",
  name: "Law of small numbers",
  family: "pattern",
  blurb: "Drawing firm conclusions from a handful of cases.",
  description:
    "Small samples swing wildly, yet we read their swings as signal. Three happy customers become product-market fit; two bad interviews become a broken pipeline; one good month becomes a trend. Clusters and streaks in random data get explanations they don't deserve.",
  cues: [
    "Conclusions from fewer than a dozen observations",
    "Patterns or streaks described in short runs of data",
    "Pilot or test results treated as settled",
  ],
  question: "How many cases is this really based on, and would I trust a coin flipped that few times?",
  counters: [
    "Write down the sample size next to every claim it supports.",
    "Ask what range of results pure chance could produce with that many cases.",
    "Run the test longer or wider before acting, if the decision can wait.",
  ],
  antidotes: ["ab_testing", "cross_validation", "bayesian"],
  aka: ["Clustering illusion", "Hot-hand fallacy"],
  source: "Tversky & Kahneman 1971",
});
