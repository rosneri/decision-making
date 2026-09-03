import { defineBias } from "../types";

export const bias = defineBias({
  id: "planning_fallacy",
  name: "Planning fallacy",
  family: "action",
  blurb: "Underestimating the time, cost and risk of a plan while overestimating its benefits.",
  description:
    "Plans are built from the inside, step by step, and each step looks reasonable. The outside view, how long such things usually take, is rarely consulted. Delivery dates and budgets are missed not because of bad luck but because the estimate never included the ordinary run of surprises.",
  cues: [
    "A timeline or budget with no contingency",
    "Estimates built bottom-up from tasks with no comparison to similar past projects",
    "'If everything goes to plan' framing",
  ],
  question: "How long did the last three things like this actually take, start to finish?",
  counters: [
    "Estimate from the outside in: find a reference class of similar efforts and use its distribution.",
    "Add explicit contingency to time and money, then ask what you'd cut if it were used up.",
    "Break the plan into milestones with a kill or continue check at each.",
  ],
  antidotes: ["reference_class", "pre_mortem", "monte_carlo"],
  source: "Kahneman & Tversky 1979; Flyvbjerg 2006",
});
