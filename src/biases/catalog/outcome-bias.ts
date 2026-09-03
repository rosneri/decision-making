import { defineBias } from "../types";

export const bias = defineBias({
  id: "outcome_bias",
  name: "Outcome bias",
  family: "pattern",
  blurb: "Judging a decision by how it turned out rather than by how it was made.",
  description:
    "A reckless bet that paid off gets praised; a careful call that lost gets punished. Over time this teaches the wrong lessons: take the risks that happened to work, avoid the disciplines that happened not to. Good decisions with bad outcomes and bad decisions with good outcomes are both common.",
  cues: [
    "Past choices rated good or bad purely by result",
    "A plan justified by 'it worked last time'",
    "Process, information and odds at the time of the decision not discussed",
  ],
  question: "Was that a good decision, or a good outcome?",
  counters: [
    "Review decisions on process and information available, separately from outcome.",
    "Ask how often that same choice would have worked across many tries.",
    "Keep a decision journal so the reasoning is on record before the result.",
  ],
  antidotes: ["aar", "pdca", "kelly"],
  source: "Baron & Hershey 1988",
});
