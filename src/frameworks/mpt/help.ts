import type { FrameworkHelp } from "../help-types";

export const help: FrameworkHelp = {
  expandedName: "Modern Portfolio Theory (Markowitz, 1952)",
  whatItIs:
    "An investor doesn't pick assets one at a time — she picks a portfolio. The right one maximizes expected return per unit of variance. Diversification across uncorrelated assets is the only way to lift Sharpe without taking more risk.",
  howToUse: [
    "List your candidate assets with expected return and volatility (annualized).",
    "Allocate weights summing to 1; the tool computes portfolio E[r], σ, and Sharpe.",
    "Reach for diversification: assets with low or negative correlation reduce σ for free.",
    "Compare Sharpe across allocations; the highest-Sharpe portfolio for a given risk tolerance is the choice.",
  ],
};
