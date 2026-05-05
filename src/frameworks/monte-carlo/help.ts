import type { FrameworkHelp } from "../help-types";

export const help: FrameworkHelp = {
    whatItIs:
      "Simulate the future thousands of times with random inputs to see the distribution of outcomes, not just one point estimate.",
    howToUse: [
      "Build a model that maps inputs → outcome.",
      "For each uncertain input, choose a probability distribution (e.g. normal with mean and std-dev).",
      "Run the model thousands of times, sampling new inputs each run.",
      "Read the output distribution: median, P10/P90, and worst-case tail. Plan against the tail, not the mean.",
    ],
    glossary: {
      "P10 / P90": "10th / 90th percentile — values exceeded 90% / 10% of the time.",
      Distribution: "The full shape of possible results, not a single number.",
    },
  };
