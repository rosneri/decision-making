import type { FrameworkHelp } from "../help-types";

export const help: FrameworkHelp = {
  expandedName: "Bayesian Update (Bayes' Rule)",
  whatItIs:
    "P(H | E) = P(E | H) · P(H) / P(E). The posterior probability of a hypothesis after seeing evidence depends on how diagnostic the evidence is — P(E|H) vs P(E|¬H) — not just whether the evidence happened.",
  howToUse: [
    "Pick the hypothesis and an honest prior (base rate is your friend).",
    "For each piece of evidence, ask: how likely is this if H is true? If false?",
    "Mark whether you observed it; the posterior updates only on observed evidence.",
    "Beware: weak evidence (P(E|H) ≈ P(E|¬H)) barely moves the posterior, no matter how vivid.",
  ],
};
