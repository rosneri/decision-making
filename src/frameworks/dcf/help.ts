import type { FrameworkHelp } from "../help-types";

export const help: FrameworkHelp = {
    expandedName: "DCF / NPV — Discounted Cash Flow / Net Present Value",
    whatItIs:
      "Future cash is worth less than cash today. Sum the discounted future cash flows of an investment and compare to its price.",
    howToUse: [
      "Project annual cash flows for the life of the investment.",
      "Pick a discount rate (your cost of capital, or the risk-adjusted required return).",
      "Discount each year's cash flow to present value: CF / (1 + r)^t.",
      "Sum them. Subtract the upfront cost — that's NPV. Positive NPV = invest; negative = don't.",
    ],
    glossary: {
      "Discount rate": "Annual rate used to shrink future cash to today's dollars; reflects risk and opportunity cost.",
      "Present Value (PV)": "What a future cash flow is worth in today's money.",
      NPV: "Net Present Value — sum of PVs minus upfront cost.",
    },
  };
