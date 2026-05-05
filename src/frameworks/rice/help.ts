import type { FrameworkHelp } from "../help-types";

export const help: FrameworkHelp = {
    expandedName: "Reach · Impact · Confidence · Effort",
    whatItIs:
      "A prioritization formula for product backlogs: score = (Reach × Impact × Confidence) ÷ Effort.",
    howToUse: [
      "List the candidate features or projects.",
      "Reach: how many users/events per time period will this touch?",
      "Impact: how much will it move the metric per user? (e.g. 0.25 minimal · 1 low · 2 medium · 3 high)",
      "Confidence: how sure are you of the above? (e.g. 50% / 80% / 100%)",
      "Effort: person-months (or any consistent unit).",
      "Sort descending. Ship the top of the list — but recheck Confidence on the leaders.",
    ],
    glossary: {
      Reach: "Number of people or events affected in a fixed period.",
      Impact: "How big the per-user effect is, on a small fixed scale.",
      Confidence: "Your honest 0–100% trust in the other three numbers.",
      Effort: "Total work, usually in person-months.",
    },
  };
