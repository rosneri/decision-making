import type { FrameworkHelp } from "../help-types";

export const help: FrameworkHelp = {
    expandedName: "Reference-Class Forecasting",
    whatItIs:
      "Stop predicting from inside the project ('this time it's different'). Find similar past projects and use their average outcome as your baseline.",
    howToUse: [
      "Define the reference class: 'projects similar to this one in scope and team'.",
      "Gather actual outcomes from that class — costs, durations, success rates.",
      "Compute the base rate (average / median) and its spread.",
      "Adjust only modestly for what's genuinely different about your case. Default to the base rate.",
    ],
  };
