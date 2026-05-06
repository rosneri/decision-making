import type { FrameworkHelp } from "../help-types";

export const help: FrameworkHelp = {
  expandedName: "Pareto Principle (80/20)",
  whatItIs:
    "An empirical observation, named for Vilfredo Pareto, that roughly 80% of effects come from 20% of causes. Useful any time you have to choose what to attack first.",
  howToUse: [
    "Pick the metric you actually care about (revenue lost, tickets opened, time spent).",
    "List the causes contributing to it and quantify each one.",
    "Sort by contribution, then identify the smallest set that adds up to ~80%.",
    "Spend your effort on those 'vital few' and ignore (or batch-handle) the long tail.",
  ],
};
