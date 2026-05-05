import type { FrameworkHelp } from "../help-types";

export const help: FrameworkHelp = {
    expandedName: "Cost-Effectiveness Analysis · QALY (Quality-Adjusted Life Year)",
    whatItIs:
      "Rank health interventions by cost per QALY gained. Fund the ones below your willingness-to-pay (WTP) threshold; defer the rest.",
    howToUse: [
      "For each intervention, estimate cost and QALYs gained vs the comparator.",
      "Compute incremental cost-effectiveness ratio (ICER): Δcost / ΔQALY.",
      "Set a WTP threshold (e.g. £30k / QALY in NICE; ~$100k–$150k US).",
      "Fund interventions with ICER below the threshold; revisit those above when costs fall.",
    ],
    glossary: {
      QALY: "1 year in perfect health = 1 QALY; lower-quality years count fractionally.",
      ICER: "Incremental Cost-Effectiveness Ratio — extra cost per extra QALY vs the comparator.",
      WTP: "Willingness-to-pay threshold — how much your system pays for one QALY.",
    },
  };
