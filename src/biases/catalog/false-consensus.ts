import { defineBias } from "../types";

export const bias = defineBias({
  id: "false_consensus",
  name: "False consensus",
  family: "social",
  blurb: "Assuming others share your preferences, values and priorities.",
  description:
    "We overestimate how many people see things our way, because the people around us mostly do. Product decisions built on 'users obviously want', hiring on 'anyone would jump at this', and negotiations on 'they must value what I value' all rest on projected preferences rather than observed ones.",
  cues: [
    "Other people's preferences asserted rather than reported ('customers want', 'they'll obviously')",
    "No evidence gathered from the people whose response matters",
    "Surprise or irritation that others don't see it the same way",
  ],
  question: "How do I know they want what I'd want?",
  counters: [
    "Ask five people in the target group before assuming; note how often they surprise you.",
    "Write the other party's priorities as they'd list them, not as you'd rank them.",
    "Treat your own preference as one data point, not as the median.",
  ],
  antidotes: ["jtbd", "structured_interview", "harvard_negotiation"],
  source: "Ross, Greene & House 1977",
});
