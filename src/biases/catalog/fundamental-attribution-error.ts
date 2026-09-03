import { defineBias } from "../types";

export const bias = defineBias({
  id: "fundamental_attribution_error",
  name: "Fundamental attribution error",
  family: "social",
  blurb: "Blaming people's character for what their situation explains.",
  description:
    "When others fall short we see personality; when we fall short we see circumstances. Decisions about hiring, firing, partnerships and conflict then treat a situational problem as a people problem, and replace the person while keeping the conditions that produced the behaviour.",
  cues: [
    "A problem explained by someone's traits ('lazy', 'difficult', 'not a fit') without examining the setup",
    "Your own misses explained by circumstance, others' by character",
    "Solutions that change the person rather than the system",
  ],
  question: "What situation would make a reasonable person behave this way?",
  counters: [
    "Before judging a person, list the incentives, constraints and information they had.",
    "Ask whether the previous person in that role had the same problem.",
    "Try the situational fix first; it's cheaper and usually right.",
  ],
  antidotes: ["five_whys", "allison_lenses", "tki"],
  aka: ["Correspondence bias"],
  source: "Ross 1977",
});
