import type { FrameworkHelp } from "../help-types";

export const help: FrameworkHelp = {
    expandedName: "Pugh Matrix (Concept Selection)",
    whatItIs:
      "Pick a baseline (the 'datum'), then score each alternative concept on each criterion as +, −, or S (same). Net positives win.",
    howToUse: [
      "Pick a baseline option as the datum (often the current solution).",
      "List criteria down the side.",
      "For each alternative concept, mark each criterion +, −, or S relative to the datum.",
      "Sum: +'s minus −'s. Best concept wins, but inspect any criterion where every concept scored −.",
    ],
    glossary: {
      Datum: "The baseline you score everything else against.",
      "+ / − / S": "Better than / worse than / same as the datum on this criterion.",
    },
  };
