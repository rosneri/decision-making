import type { FrameworkHelp } from "../help-types";

export const help: FrameworkHelp = {
    expandedName: "WPA — Win Probability Added",
    whatItIs:
      "From sports analytics: pick the option whose expected change in win probability is largest, even if it 'feels' riskier.",
    howToUse: [
      "Estimate current win probability from the situation.",
      "For each option, estimate the win probability after each plausible outcome × its likelihood.",
      "WPA per option = (expected new WP) − (current WP).",
      "Pick the largest WPA — that's mathematically the best move, gut feel notwithstanding.",
    ],
    glossary: {
      WP: "Win Probability — your chance of winning given the current state.",
      WPA: "Win Probability Added — expected change in WP from a given choice.",
    },
  };
