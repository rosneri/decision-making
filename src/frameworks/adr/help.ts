import type { FrameworkHelp } from "../help-types";

export const help: FrameworkHelp = {
    expandedName: "ADR — Architecture Decision Record",
    whatItIs:
      "A short, dated, immutable doc capturing one architectural choice: the context, the decision, alternatives considered, and consequences.",
    howToUse: [
      "Title + date + status (Proposed / Accepted / Superseded).",
      "Context: the forces and constraints in play.",
      "Decision: what you're doing, in active voice.",
      "Alternatives: what you considered and rejected, with one-line reasons.",
      "Consequences: what becomes easier, harder, or impossible because of this choice.",
      "Never edit history — supersede with a new ADR if the decision changes.",
    ],
  };
