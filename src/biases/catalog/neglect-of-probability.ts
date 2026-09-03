import { defineBias } from "../types";

export const bias = defineBias({
  id: "neglect_of_probability",
  name: "Neglect of probability",
  family: "framing",
  blurb: "Reacting to what could happen without regard to how likely it is.",
  description:
    "Outcomes that are frightening or thrilling get evaluated on their size alone; a one-in-a-million and a one-in-ten feel much the same. Decisions then insure against remote catastrophes, chase remote jackpots, and ignore the moderate-probability events that actually shape results.",
  cues: [
    "A dramatic outcome discussed with no estimate of its probability",
    "Worst-case or best-case scenarios treated as if they were likely",
    "Precautions or bets sized by outcome rather than by odds times outcome",
  ],
  question: "Roughly how likely is that, and have I multiplied by it?",
  counters: [
    "Attach a probability, even a rough one, to every scenario you're weighing.",
    "Compute expected value or expected cost before deciding how much to worry.",
    "For remote risks, ask what it would cost to be resilient rather than to be safe.",
  ],
  antidotes: ["monte_carlo", "bayesian", "fmea"],
  source: "Rottenstreich & Hsee 2001",
});
