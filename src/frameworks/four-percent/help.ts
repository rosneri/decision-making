import type { FrameworkHelp } from "../help-types";

export const help: FrameworkHelp = {
  expandedName: "The 4% Rule (Trinity Study / FIRE)",
  whatItIs:
    "Bengen's 1994 finding (refined by the Trinity Study) that retirees withdrawing 4% of their initial portfolio per year, adjusted for inflation, almost never ran out of money over 30 years in historical US data. The simplest formula in personal finance: target = annual spend × 25.",
  howToUse: [
    "Estimate honest annual spend in retirement (today's dollars).",
    "Multiply by 25 (4% rule) for your number; pick a lower rate for more conservative or longer horizons.",
    "Plug in current savings, monthly contribution, and an after-inflation real return (~5–7% historical for equities-tilted).",
    "The years-to-FIRE depends on savings rate more than market return — cutting spend lowers the target AND raises savings rate.",
  ],
};
