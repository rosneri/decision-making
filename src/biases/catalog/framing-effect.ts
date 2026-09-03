import { defineBias } from "../types";

export const bias = defineBias({
  id: "framing_effect",
  name: "Framing effect",
  family: "framing",
  blurb: "Reaching a different answer depending on how the same question is worded.",
  description:
    "'90% survive' and '10% die' describe one fact and produce different choices. Whether an option is presented as a gain or a loss, a saving or a cost, a chance or a threat, shifts the decision without any change in substance. Whoever frames the question has already made half the decision.",
  cues: [
    "The decision stated only in gain terms or only in loss terms",
    "A question posed by someone else, in their words, and answered in those words",
    "Percentages, absolute numbers or time-scales chosen in a way that flatters one side",
  ],
  question: "How would this look if I described it the opposite way round?",
  counters: [
    "Restate the decision in the opposite frame: losses as gains, costs as savings, rates as counts.",
    "Write the question yourself from scratch before answering anyone else's version of it.",
    "If the choice flips between frames, the frame is doing the deciding; look at the substance.",
  ],
  antidotes: ["inversion", "six_hats", "first_principles"],
  source: "Tversky & Kahneman 1981",
});
