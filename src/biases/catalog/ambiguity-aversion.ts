import { defineBias } from "../types";

export const bias = defineBias({
  id: "ambiguity_aversion",
  name: "Ambiguity aversion",
  family: "stability",
  blurb: "Preferring known risks over unknown ones even when the unknown is better.",
  description:
    "A gamble with clear odds feels safer than one with fuzzy odds, even when the fuzzy one is likely more favourable. So people choose the option they can quantify over the one they can't, and mistake 'I don't know the odds' for 'the odds are bad'. New markets, unusual careers and unfamiliar partners get penalised for being unfamiliar.",
  cues: [
    "An option rejected because its outcomes are 'unknowable' rather than because they're bad",
    "Preference for the measurable option without asking whether it measures well",
    "'Better the devil you know'",
  ],
  question: "Are the odds here actually bad, or just unclear?",
  counters: [
    "Estimate the unknown odds anyway, with a wide range, rather than treating them as zero.",
    "Ask what cheap information would narrow the uncertainty before deciding.",
    "Compare the ambiguous option's plausible range against the certain option's fixed value.",
  ],
  antidotes: ["monte_carlo", "bayesian", "lean"],
  aka: ["Ellsberg paradox", "Uncertainty aversion"],
  source: "Ellsberg 1961",
});
