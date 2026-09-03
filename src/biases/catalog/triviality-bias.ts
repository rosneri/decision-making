import { defineBias } from "../types";

export const bias = defineBias({
  id: "triviality_bias",
  name: "Bikeshedding",
  family: "framing",
  blurb: "Spending attention in proportion to how easy a question is, not how much it matters.",
  description:
    "Everyone has an opinion on the colour of the bike shed and nobody on the nuclear reactor, so the shed gets the meeting time. In decisions, the tangible and familiar sub-questions absorb the effort while the consequential and uncertain ones get waved through. The write-up is long on details and short on the crux.",
  cues: [
    "Detailed treatment of minor points alongside a thin treatment of the main uncertainty",
    "The decisive question stated but not examined",
    "Debate over things that are easy to have opinions about",
  ],
  question: "Which single question, if answered, would settle most of this, and how much time did it get?",
  counters: [
    "Rank the sub-questions by how much they'd change the outcome and spend time in that order.",
    "Give the crux a time budget of its own before touching anything else.",
    "Ask what you're avoiding by spending time on the easy parts.",
  ],
  antidotes: ["pareto", "first_principles", "moscow"],
  aka: ["Parkinson's law of triviality"],
  source: "Parkinson 1957",
});
