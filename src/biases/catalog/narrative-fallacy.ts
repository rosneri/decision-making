import { defineBias } from "../types";

export const bias = defineBias({
  id: "narrative_fallacy",
  name: "Narrative fallacy",
  family: "pattern",
  blurb: "Trusting a tidy story over the messy facts it was built from.",
  description:
    "A coherent account of why something happened, or why it will, feels like understanding. The neater the story, the more confident we become, though neatness says nothing about truth. Strategy cases, hiring narratives and personal 'this is my path' stories all fall prey to it.",
  cues: [
    "A clean cause-and-effect story with no loose ends",
    "Confidence that rises with the coherence of the explanation",
    "Alternative explanations for the same facts not considered",
  ],
  question: "What other story fits these same facts equally well?",
  counters: [
    "Write two competing explanations and note what evidence would separate them.",
    "List the facts on their own, stripped of the story, and see what they support.",
    "Distrust any account with no surprises in it.",
  ],
  antidotes: ["ach", "first_principles", "five_whys"],
  aka: ["Storytelling bias"],
  source: "Taleb 2007",
});
