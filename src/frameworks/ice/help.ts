import type { FrameworkHelp } from "../help-types";

export const help: FrameworkHelp = {
  expandedName: "ICE Score (Sean Ellis)",
  whatItIs:
    "A back-of-envelope prioritization score: Impact × Confidence × Ease, each on 1–10. Faster than RICE, useful for growth experiments and any list of small bets.",
  howToUse: [
    "List candidate ideas — coarsely, not exhaustively.",
    "Score each on the three dimensions; calibrate as a team to avoid drift.",
    "The product (not sum) drops weak items quickly — a 1 in any column ≈ veto.",
    "Run the top item, learn, re-score; ICE rewards short cycles.",
  ],
};
