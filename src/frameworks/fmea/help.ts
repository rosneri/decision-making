import type { FrameworkHelp } from "../help-types";

export const help: FrameworkHelp = {
  expandedName: "Failure Mode and Effects Analysis",
  whatItIs:
    "A bottom-up reliability technique developed by the US military and adopted across aerospace, automotive, and software. For each potential failure, you score severity, likelihood, and detectability, multiply for a Risk Priority Number, then attack the highest.",
  howToUse: [
    "List every failure mode you can imagine for the system, function-by-function.",
    "Score each on a 1–10 scale: severity of effect, occurrence likelihood, detectability (10 = undetectable).",
    "Compute RPN = S × O × D. Anything ≥ 100 deserves an explicit mitigation owner.",
    "After mitigation, re-score and re-rank — the top item should rotate over time.",
  ],
};
