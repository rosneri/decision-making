import { defineBias } from "../types";

export const bias = defineBias({
  id: "normalcy_bias",
  name: "Normalcy bias",
  family: "stability",
  blurb: "Assuming things will keep working the way they always have.",
  description:
    "Because a disruption hasn't happened before, or not recently, we plan as though it can't. Early warning signs get read as noise, and the response to a real shift is late and small. It applies to markets, technologies, health, relationships and infrastructure alike: the past's stability is not evidence of the future's.",
  cues: [
    "Plans that assume current conditions persist indefinitely",
    "Warning signs mentioned and then discounted as one-offs",
    "'That's never happened' used as a reason to ignore a scenario",
  ],
  question: "What would the world have to look like for this plan to break, and how far are we from that?",
  counters: [
    "Write the scenario where the assumption fails and estimate its probability honestly.",
    "Define in advance what signal would mean 'this is no longer normal' and what you'd do.",
    "Ask what changed in the last five years that you'd once have called impossible.",
  ],
  antidotes: ["pre_mortem", "pestel", "second_order"],
  source: "Omer & Alon 1994",
});
