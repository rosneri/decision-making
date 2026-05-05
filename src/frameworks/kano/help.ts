import type { FrameworkHelp } from "../help-types";

export const help: FrameworkHelp = {
    expandedName: "Kano Model of Customer Satisfaction",
    whatItIs:
      "Sort features by how their presence/absence drives satisfaction. Some are required; some delight; some don't matter.",
    howToUse: [
      "List candidate features.",
      "Tag each as: Must-have (absence kills you, presence is invisible), Performance (more = better, linearly), Delighter (unexpected, creates love), or Indifferent.",
      "Cover all Must-haves before any Delighter — table-stakes failures sink everything.",
      "Invest in Delighters sparingly; they decay into Performance, then into Must-haves over time.",
    ],
  };
