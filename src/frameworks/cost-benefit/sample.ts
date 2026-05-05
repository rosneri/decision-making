import { meta } from "./meta";
import type { CostBenefit } from "./schema";

export const sample: CostBenefit = {
  framework: "cost_benefit",
  category: meta.category,
  title: "Whether to take the new role",
  benefits: [
    { text: "Higher salary",               weight: 3 },
    { text: "Stronger team to learn from", weight: 4 },
    { text: "Better long-term trajectory", weight: 5 },
  ],
  costs: [
    { text: "Walking away from current work", weight: 4 },
    { text: "Steeper ramp-up",               weight: 2 },
    { text: "Less time at home",             weight: 3 },
  ],
  recommendation:
    "The benefit side carries by a small margin. The long-term trajectory item is the deciding weight — if that resonates, lean toward taking the role.",
};
