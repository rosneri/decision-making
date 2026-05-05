import type { FrameworkHelp } from "../help-types";

export const help: FrameworkHelp = {
    whatItIs:
      "Instead of asking 'how do I make this succeed?', ask 'how would this fail?' and avoid each failure mode.",
    howToUse: [
      "Write the goal in one sentence.",
      "Brainstorm every plausible way this could fail or go badly.",
      "For each failure mode, list a concrete prevention or early-warning signal.",
      "Build the plan around avoiding the worst few failures, not maximizing every upside.",
    ],
  };
