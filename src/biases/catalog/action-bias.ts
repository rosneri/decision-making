import { defineBias } from "../types";

export const bias = defineBias({
  id: "action_bias",
  name: "Action bias",
  family: "action",
  blurb: "Preferring to do something, anything, over waiting even when waiting is better.",
  description:
    "Acting feels like progress and gets credit; waiting feels like weakness and gets none. So people ship the change, make the hire, send the message, when the evidence says hold. Goalkeepers dive on penalties for the same reason, though staying put stops more.",
  cues: [
    "Urgency that isn't explained by a real deadline",
    "'We have to do something' or 'I can't just sit here'",
    "Waiting, gathering more information or a pilot dismissed as passivity",
  ],
  question: "What happens if I do nothing for a month, and is that actually worse?",
  counters: [
    "Put 'wait and watch' on the list as a real option and evaluate it like the others.",
    "Name the cost of delay in numbers; if you can't, the urgency is emotional.",
    "Set a review date rather than deciding now.",
  ],
  antidotes: ["eisenhower", "regret_min", "ooda"],
  source: "Bar-Eli et al. 2007",
});
