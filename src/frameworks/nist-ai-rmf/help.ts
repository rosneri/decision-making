import type { FrameworkHelp } from "../help-types";

export const help: FrameworkHelp = {
  expandedName: "NIST AI Risk Management Framework",
  whatItIs:
    "A voluntary US-government framework for trustworthy AI built on four functions — Govern, Map, Measure, Manage — applied iteratively across an AI system's lifecycle.",
  howToUse: [
    "Govern: write the policies and assign owners before the system goes live.",
    "Map: describe the use case, stakeholders, and harms that could result.",
    "Measure: pick concrete metrics (accuracy, bias, robustness) and audit them.",
    "Manage: deploy controls (HITL, kill-switches, escalation) sized to the risk level.",
    "Loop: re-run when the system, its data, or its deployment context changes.",
  ],
};
