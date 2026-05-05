import type { FrameworkHelp } from "../help-types";

export const help: FrameworkHelp = {
    expandedName: "Learned Hand Formula (B < PL)",
    whatItIs:
      "A negligence test: if the burden of taking precaution (B) is less than probability of harm (P) × loss if it happens (L), failing to take it is negligent.",
    howToUse: [
      "Estimate B: the cost of the precaution.",
      "Estimate P: the probability of harm if you don't take it.",
      "Estimate L: the magnitude of harm if it happens.",
      "If B < P × L, take the precaution. Document the calculation.",
    ],
    glossary: {
      B: "Burden — cost of preventing the harm.",
      P: "Probability that the harm happens without prevention.",
      L: "Loss — size of the harm if it happens.",
    },
  };
