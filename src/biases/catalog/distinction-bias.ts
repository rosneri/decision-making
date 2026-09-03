import { defineBias } from "../types";

export const bias = defineBias({
  id: "distinction_bias",
  name: "Distinction bias",
  family: "framing",
  blurb: "Overvaluing small differences because you're comparing options side by side.",
  description:
    "When two options sit next to each other, every difference between them looks significant, including ones you'd never notice living with either. A slightly larger salary, a marginally better screen, a somewhat shorter commute: the comparison magnifies them. Choices made in comparison mode often disappoint in experience mode.",
  cues: [
    "A decision turning on a small numeric difference between otherwise similar options",
    "Side-by-side spreadsheet comparison with many close scores",
    "Little consideration of how each option would feel on its own",
  ],
  question: "Would I notice this difference a month after choosing?",
  counters: [
    "Evaluate each option alone for a day, as if it were the only one, before comparing.",
    "Ask which differences you'd actually experience versus merely observe.",
    "Set a threshold below which differences count as ties, and break ties on what matters to daily life.",
  ],
  antidotes: ["ikigai", "odyssey", "kano"],
  source: "Hsee & Zhang 2004",
});
