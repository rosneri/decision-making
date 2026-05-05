import type { FrameworkHelp } from "../help-types";

export const help: FrameworkHelp = {
    expandedName: "Kelly Criterion (bet-sizing formula)",
    whatItIs:
      "Optimal long-run bet size given your edge and the odds: f* = (bp − q) / b, where p = win probability, q = 1−p, b = net odds.",
    howToUse: [
      "Estimate p — your true probability of winning. Be honest.",
      "Identify b — the net odds (win £b for every £1 risked).",
      "Compute f* = (bp − q) / b. That's the fraction of bankroll to bet.",
      "Most professionals use 'half-Kelly' (½ × f*) — the math optimum is too volatile to live with.",
      "If f* ≤ 0, don't bet — you have no edge.",
    ],
    glossary: {
      "f*": "Optimal fraction of bankroll to wager.",
      p: "Probability of winning.",
      q: "Probability of losing (1 − p).",
      b: "Net odds — how many units you win per unit risked.",
    },
  };
