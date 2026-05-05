import type { FrameworkHelp } from "../help-types";

export const help: FrameworkHelp = {
    expandedName: "Algorithmic Impact Assessment",
    whatItIs:
      "Pre-deployment risk audit for ML systems. Score multiple risk dimensions; one open high-severity item blocks shipping.",
    howToUse: [
      "Enumerate risk dimensions: bias, privacy, security, contestability, transparency, environmental, etc.",
      "For each, score severity and likelihood, and document mitigations in place.",
      "Any unmitigated High/Severe item is a blocker — not negotiable.",
      "Review at every major retrain or use-case expansion, not just once.",
    ],
  };
