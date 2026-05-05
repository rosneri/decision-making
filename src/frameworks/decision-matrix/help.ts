import type { FrameworkHelp } from "../help-types";

export const help: FrameworkHelp = {
    whatItIs:
      "A weighted scoring table: list options down the side, criteria across the top, and let the math pick a winner.",
    howToUse: [
      "List the options you're choosing between (one per row).",
      "List the criteria that matter (cost, speed, fit…) and weight each one — bigger weight = more important.",
      "Score every option on every criterion (e.g. 1–5).",
      "The total = Σ (score × weight). Highest total wins, but sanity-check the top two.",
    ],
  };
