import { defineBias } from "../types";

export const bias = defineBias({
  id: "base_rate_neglect",
  name: "Base-rate neglect",
  family: "pattern",
  blurb: "Ignoring how often something happens in general because this case looks special.",
  description:
    "Specific details about this candidate, this startup or this market make it feel like its own story, and the background rate for such things gets dropped. But the base rate is usually the single best predictor. Most new restaurants close, most reorganisations underdeliver, most people who feel certain are wrong at about the normal rate.",
  cues: [
    "Reasons why 'this one is different' without a statement of how such things usually go",
    "Judging fit from resemblance to a type rather than from track record",
    "No numbers for how often the hoped-for outcome occurs in general",
  ],
  question: "Before I look at the specifics, what's the base rate for this kind of thing?",
  counters: [
    "Start from the base rate, then adjust for the specifics, and be stingy with the adjustment.",
    "Write the reference class explicitly: 'things like this' means what, exactly?",
    "Ask what fraction of people with this much conviction turned out right.",
  ],
  antidotes: ["reference_class", "bayesian", "structured_interview"],
  aka: ["Representativeness heuristic"],
  source: "Kahneman & Tversky 1973",
});
