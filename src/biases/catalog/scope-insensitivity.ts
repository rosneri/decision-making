import { defineBias } from "../types";

export const bias = defineBias({
  id: "scope_insensitivity",
  name: "Scope insensitivity",
  family: "framing",
  blurb: "Feeling roughly the same about a problem whether it's ten times bigger or smaller.",
  description:
    "Our reaction to a problem is driven by its image, not its magnitude. Saving two thousand birds and two hundred thousand birds prompt similar donations; a bug affecting ten users and ten thousand gets similar urgency. Decisions then allocate effort by how vivid an issue is rather than by how much of it there is.",
  cues: [
    "Priorities set without numbers for how many people, dollars or units are affected",
    "A small case given the same weight as a large one",
    "Emotional response to a single instance driving a general policy",
  ],
  question: "How many, how much, how often, and does my reaction scale with that?",
  counters: [
    "Put a quantity next to every problem and rank by quantity before ranking by feel.",
    "Ask what you'd do if the number were ten times larger, then ten times smaller.",
    "Use expected impact (reach times effect) rather than salience.",
  ],
  antidotes: ["pareto", "rice", "qaly"],
  aka: ["Scope neglect"],
  source: "Desvousges et al. 1993; Kahneman & Frederick 2002",
});
