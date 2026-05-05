import type { FrameworkHelp } from "../help-types";

export const help: FrameworkHelp = {
    expandedName: "RIA — Regulatory Impact Assessment",
    whatItIs:
      "Before introducing a regulation, sum its impacts across stakeholders weighted by their power and exposure. Flag groups that need active mitigation.",
    howToUse: [
      "List every stakeholder group affected.",
      "Score the regulation's impact on each (positive/negative, magnitude).",
      "Weight by the group's exposure / power / vulnerability.",
      "Sum. Negative-weighted-sum groups need explicit mitigation, transition support, or carve-outs.",
    ],
  };
