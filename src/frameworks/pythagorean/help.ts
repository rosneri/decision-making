import type { FrameworkHelp } from "../help-types";

export const help: FrameworkHelp = {
    expandedName: "Pythagorean Expectation (Bill James)",
    whatItIs:
      "Expected win % from points-for² ÷ (points-for² + points-against²). Teams whose actual record is far above this tend to regress.",
    howToUse: [
      "Compute PF (points/runs scored) and PA (points/runs allowed) over the period.",
      "Expected W% = PF² / (PF² + PA²).",
      "Compare to actual W%. Big positive gap → likely regression downward; big negative → likely improvement.",
      "Use the expected number, not the actual record, to project forward.",
    ],
    glossary: {
      PF: "Points / runs scored.",
      PA: "Points / runs allowed.",
    },
  };
