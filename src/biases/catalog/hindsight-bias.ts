import { defineBias } from "../types";

export const bias = defineBias({
  id: "hindsight_bias",
  name: "Hindsight bias",
  family: "pattern",
  blurb: "Believing past outcomes were more predictable than they were.",
  description:
    "Once we know how something turned out, it seems obvious that it would, and we misremember our own uncertainty at the time. This distorts what we learn from the past and makes us harsher on people who decided under real uncertainty, including our earlier selves. Post-mortems and reviews suffer most.",
  cues: [
    "'I knew it' or 'it was obvious' about something that was contested at the time",
    "Past decisions judged by their outcome rather than by what was known",
    "Confidence that the next similar case is now easy to call",
  ],
  question: "What did I actually believe before I knew the result?",
  counters: [
    "Record predictions and confidence before outcomes arrive, and review against them.",
    "In any review, reconstruct what was known at the time and judge the process, not the result.",
    "Ask what would have made the other outcome look obvious instead.",
  ],
  antidotes: ["aar", "pre_mortem", "bayesian"],
  aka: ["Knew-it-all-along effect"],
  source: "Fischhoff 1975",
});
