import { defineBias } from "../types";

export const bias = defineBias({
  id: "availability_heuristic",
  name: "Availability heuristic",
  family: "pattern",
  blurb: "Judging how likely something is by how easily examples come to mind.",
  description:
    "Vivid, recent or personally experienced events feel more probable than dull, distant or statistical ones. A friend's layoff, one bad flight, a startup that made the news, each swells in the estimate. The decision then over-prepares for the memorable risk and under-prepares for the common one.",
  cues: [
    "A single striking anecdote doing the work of a probability",
    "Risks that are in the news weighed above risks that are merely frequent",
    "'I know someone who…' as the main evidence",
  ],
  question: "Is this likely, or is it just easy to picture?",
  counters: [
    "Look up the actual frequency before deciding how much weight the risk deserves.",
    "For each vivid example, ask how many quiet counter-examples you never heard about.",
    "Rank risks by expected cost, not by how quickly they came to mind.",
  ],
  antidotes: ["reference_class", "bayesian", "fmea"],
  source: "Tversky & Kahneman 1973",
});
