import type { FrameworkHelp } from "../help-types";

export const help: FrameworkHelp = {
  expandedName: "Elo Rating System",
  whatItIs:
    "Arpad Elo's pairwise rating, developed for chess and now used everywhere from FIFA rankings to A/B model evaluation. Each player's rating updates based on the gap between expected and actual result.",
  howToUse: [
    "Seed each player at a baseline (1500 is conventional).",
    "Pick a K-factor: 16 for stable populations, 32 for typical clubs, 40+ for new arrivals.",
    "After each match, the winner gains K·(1 − expected) points; loser loses the same.",
    "Beating a stronger opponent gains more; the system self-corrects with enough games.",
  ],
};
