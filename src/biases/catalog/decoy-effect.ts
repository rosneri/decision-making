import { defineBias } from "../types";

export const bias = defineBias({
  id: "decoy_effect",
  name: "Decoy effect",
  family: "framing",
  blurb: "Changing your choice because of an option you'd never pick.",
  description:
    "Add a third option that is clearly worse than one of the two on offer, and the option it resembles suddenly looks better. Pricing tiers, job offers and vendor shortlists are full of decoys, some deliberate and some accidental. Preferences should not depend on the presence of options you'd reject, but they do.",
  cues: [
    "A comparison set that includes an option nobody would choose",
    "Preference between two options justified by reference to a third",
    "'Compared to X, Y is a bargain'",
  ],
  question: "Would I still choose this if the option I'm not picking weren't on the table?",
  counters: [
    "Remove the obviously-dominated options and re-run the comparison with what's left.",
    "Evaluate each option against your needs, not against its neighbours.",
    "Ask who assembled the set of options and what they gain from its shape.",
  ],
  antidotes: ["decision_matrix", "first_principles", "pugh"],
  aka: ["Asymmetric dominance", "Attraction effect"],
  source: "Huber, Payne & Puto 1982",
});
