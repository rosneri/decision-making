import { defineBias } from "../types";

export const bias = defineBias({
  id: "stereotyping",
  name: "Stereotyping",
  family: "social",
  blurb: "Judging an individual by beliefs about the group they belong to.",
  description:
    "Age, gender, nationality, school, industry, accent: group membership supplies a ready-made expectation that stands in for evidence about the person or case in front of you. It is fast, mostly unconscious and unfair in both directions, and it degrades hiring, lending, medical and partnership decisions in ways that are now well measured.",
  cues: [
    "Judgements about a person or organisation that reference a category they belong to",
    "Expectations stated before any individual evidence is discussed",
    "'People like that tend to…'",
  ],
  question: "What do I actually know about this person, apart from what group they're in?",
  counters: [
    "Decide the evaluation criteria in advance and score only on observed evidence.",
    "Blind the group markers where possible: names, photos, schools.",
    "Ask what you'd conclude from the same facts about someone from a different group.",
  ],
  antidotes: ["structured_interview", "veil_of_ignorance", "scorecard"],
  aka: ["Implicit bias", "Affinity bias"],
  source: "Greenwald & Banaji 1995",
});
