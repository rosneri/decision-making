import { defineBias } from "../types";

export const bias = defineBias({
  id: "sunk_cost_fallacy",
  name: "Sunk cost fallacy",
  family: "stability",
  blurb: "Continuing because of what's already been spent rather than what's still to gain.",
  description:
    "Money, time and effort already spent cannot be recovered whatever you decide next, so they should carry no weight. Yet the urge to 'not let it go to waste' keeps people in degrees, projects, relationships and investments long after the forward-looking case has collapsed.",
  cues: [
    "Past investment ('two years', '$200k', 'all that work') cited as a reason to continue",
    "'Too far in to stop now'",
    "Forward costs and benefits not stated separately from what's already gone",
  ],
  question: "If I were starting today with no history, would I choose to begin this?",
  counters: [
    "Cross out everything already spent and evaluate only the road ahead.",
    "Ask what the resources needed to continue would earn if used elsewhere.",
    "Set exit criteria in advance so the decision doesn't have to be made under the weight of the past.",
  ],
  antidotes: ["sunk_cost", "inversion", "cost_benefit"],
  source: "Arkes & Blumer 1985",
});
