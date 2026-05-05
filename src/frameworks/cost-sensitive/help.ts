import type { FrameworkHelp } from "../help-types";

export const help: FrameworkHelp = {
    expandedName: "Cost-Sensitive Threshold Tuning",
    whatItIs:
      "When false positives and false negatives cost different amounts, the right classifier threshold is the one that minimizes total dollar cost — not the one that maximizes accuracy.",
    howToUse: [
      "Estimate the dollar cost of a false positive (acting when you shouldn't).",
      "Estimate the dollar cost of a false negative (missing when you should act).",
      "For each candidate threshold, compute expected total cost from your validation set.",
      "Pick the threshold with lowest expected cost. It's almost never the 0.5 default.",
    ],
    glossary: {
      "False positive": "Model says yes, truth is no.",
      "False negative": "Model says no, truth is yes.",
      Threshold: "Probability cutoff above which you act on the model's prediction.",
    },
  };
