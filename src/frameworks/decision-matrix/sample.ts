import { meta } from "./meta";
import type { DecisionMatrix } from "./schema";

export const sample: DecisionMatrix = {
  framework: "decision_matrix",
  category: meta.category,
  title: "Choosing a new laptop",
  criteria: [
    { name: "Price", weight: 8 },
    { name: "Performance", weight: 9 },
    { name: "Battery", weight: 6 },
    { name: "Build quality", weight: 5 },
  ],
  options: [
    { name: "MacBook Pro 14", scores: [4, 9, 8, 9] },
    { name: "Dell XPS 15", scores: [6, 8, 6, 7] },
    { name: "ThinkPad X1", scores: [7, 7, 9, 8] },
  ],
  recommendation:
    "Try the sliders — adjust weights based on what matters most to you and the highlighted winner will update.",
};
