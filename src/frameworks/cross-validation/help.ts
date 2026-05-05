import type { FrameworkHelp } from "../help-types";

export const help: FrameworkHelp = {
    whatItIs:
      "Don't trust a model from one train/test split. Split the data into k folds, train k times, and pick a model with high mean and low variance across folds.",
    howToUse: [
      "Split data into k folds (typically 5 or 10).",
      "For each fold, train on the other k-1 folds and evaluate on this one.",
      "Record the score per fold per candidate model.",
      "Pick the model with high mean score AND low variance — high variance means it'll be unreliable in production.",
    ],
    glossary: {
      Fold: "One of k roughly-equal slices of the dataset used as a hold-out turn.",
      Variance: "How much the score swings between folds — proxy for instability.",
    },
  };
