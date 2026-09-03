import { defineBias } from "../types";

export const bias = defineBias({
  id: "novelty_bias",
  name: "Novelty bias",
  family: "pattern",
  blurb: "Rating the new thing higher because it's new.",
  description:
    "New tools, new markets, new methods and new people carry a glow that has nothing to do with their merit. The known option's flaws are familiar and boring; the new option's flaws haven't been met yet. Technology choices, rebrands and 'fresh start' moves are especially exposed.",
  cues: [
    "The newer option described with excitement, the incumbent with fatigue",
    "Novelty itself cited as an advantage ('modern', 'next-gen', 'fresh')",
    "Little evidence about the new option's failure modes",
  ],
  question: "Would I still prefer this if it were five years old and the other option were new?",
  counters: [
    "List the incumbent's strengths as carefully as the newcomer's.",
    "Ask what the new option will look like once its novelty has worn off.",
    "Find people two years into the new thing and ask what they wish they'd known.",
  ],
  antidotes: ["wardley", "pugh", "second_order"],
  aka: ["Pro-innovation bias", "Shiny-object syndrome"],
  source: "Rogers 1962",
});
