import type { FrameworkHelp } from "../help-types";

export const help: FrameworkHelp = {
    expandedName: "ACH — Analysis of Competing Hypotheses",
    whatItIs:
      "A CIA technique: list all hypotheses, score each piece of evidence against each, and prefer the hypothesis with fewest contradictions (not the most confirmations).",
    howToUse: [
      "List every plausible hypothesis — including ones you don't like.",
      "List every piece of evidence (and notable absences of evidence).",
      "For each evidence × hypothesis cell, mark Consistent, Inconsistent, or Not Applicable.",
      "The hypothesis with the fewest Inconsistents wins. Confirmations are cheap; contradictions are decisive.",
    ],
  };
