import { defineBias } from "../types";

export const bias = defineBias({
  id: "bandwagon_effect",
  name: "Bandwagon effect",
  family: "social",
  blurb: "Doing something because many others are doing it.",
  description:
    "Popularity feels like evidence: if everyone is adopting the tool, moving to the city, buying the asset or leaving the industry, they must know something. Often they are each watching the others. The crowd can be right, but its size is not the reason, and fashions in strategy and careers reverse regularly.",
  cues: [
    "'Everyone is doing it' or 'the industry is moving to' as a main reason",
    "Fear of being left behind",
    "Little independent analysis of whether the popular option fits your situation",
  ],
  question: "Would I choose this if I were the only one doing it?",
  counters: [
    "Write the case for the option without reference to who else has chosen it.",
    "Ask what those adopting it have in common with you, and what they don't.",
    "Look for the people who considered it and declined, and ask why.",
  ],
  antidotes: ["first_principles", "wardley", "jtbd"],
  aka: ["Social proof", "Herding"],
  source: "Asch 1951; Banerjee 1992",
});
