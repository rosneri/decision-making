import { defineBias } from "../types";

export const bias = defineBias({
  id: "recency_bias",
  name: "Recency bias",
  family: "pattern",
  blurb: "Letting the latest data point outweigh the whole record.",
  description:
    "The last quarter, the most recent conversation or this week's mood dominates the picture. Trends are extrapolated from their most recent segment and long-run patterns discounted. Decisions taken right after a win look reckless, and right after a loss look timid, for the same underlying situation.",
  cues: [
    "A very recent event cited as the trigger for a large decision",
    "Trend extrapolated from the last few data points",
    "Long history mentioned only in passing, if at all",
  ],
  question: "Would I decide the same way if the last month had been average?",
  counters: [
    "Look at the full history on one chart before weighing the latest point.",
    "Wait a fixed cooling-off period after a strong recent event before committing.",
    "Weight periods by how informative they are, not by how recent.",
  ],
  antidotes: ["reference_class", "pdca", "aar"],
  aka: ["Saliency bias", "Peak–end rule"],
  source: "Lovallo & Sibony 2010",
});
