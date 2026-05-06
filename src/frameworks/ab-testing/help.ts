import type { FrameworkHelp } from "../help-types";

export const help: FrameworkHelp = {
  expandedName: "A/B Testing (randomized controlled experiment)",
  whatItIs:
    "Split traffic randomly between a control and a treatment, measure a single metric, and decide based on whether the lift is statistically distinguishable from zero.",
  howToUse: [
    "State a falsifiable hypothesis and pick one primary metric before launching.",
    "Estimate the sample size needed to detect a meaningful lift; do not peek early.",
    "Run until you hit the planned N (or fixed duration); randomize at the right unit (user, not session).",
    "Compute the p-value against your α; ship only if it crosses and the lift is practically meaningful.",
  ],
};
