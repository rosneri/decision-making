import type { FrameworkHelp } from "../help-types";

export const help: FrameworkHelp = {
  expandedName: "Nash Equilibrium",
  whatItIs:
    "John Nash's 1950 result: in any finite game, there exists at least one strategy profile where no player can improve by unilaterally changing strategy. It's the resting point — even if it isn't best for anyone.",
  howToUse: [
    "Identify the two players and the choices each can make.",
    "Fill in the 2×2 payoffs as (row, column).",
    "Find pure equilibria: a cell where row's payoff is best given column's choice, AND column's is best given row's.",
    "If multiple cells qualify, the game has multiple equilibria — coordination matters. If none, only mixed strategies equilibrate.",
  ],
};
