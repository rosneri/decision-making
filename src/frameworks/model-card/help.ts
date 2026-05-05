import type { FrameworkHelp } from "../help-types";

export const help: FrameworkHelp = {
    whatItIs:
      "A short, standardized doc that ships with an ML model: intended use, training data, performance across slices, ethical concerns, and known limitations.",
    howToUse: [
      "Intended use: what the model is for — and explicitly what it's not for.",
      "Training data: source, time period, known biases, license.",
      "Performance: overall and broken down by relevant slices (demographic, geographic, etc.).",
      "Ethical considerations: known harms, mitigations, and gaps.",
      "Caveats: failure modes and edge cases users should know about.",
      "Publish before release; update when the model is retrained or repurposed.",
    ],
  };
