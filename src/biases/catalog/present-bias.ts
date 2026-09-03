import { defineBias } from "../types";

export const bias = defineBias({
  id: "present_bias",
  name: "Present bias",
  family: "interest",
  blurb: "Overweighting what you get or avoid now against what comes later.",
  description:
    "Rewards close at hand feel far larger than the same reward next year, and costs close at hand feel far worse. This steepness fades with distance, which is why plans made for the future look prudent and choices made today look impulsive. It shows up in cash-versus-equity, rest-versus-training, ship-now-versus-fix-first.",
  cues: [
    "An immediate benefit or relief weighed against a larger but delayed one",
    "Future costs mentioned vaguely, present costs in detail",
    "'I just need this now' or 'later me can deal with it'",
  ],
  question: "Would I make this choice for a year from now the same way I'm making it for today?",
  counters: [
    "Restate both options as they'd look from twelve months out, then choose.",
    "Convert the delayed benefit into today's terms with a discount rate you'd defend.",
    "Precommit: decide the rule now, apply it later when the pull is strongest.",
  ],
  antidotes: ["odyssey", "dcf", "second_order"],
  aka: ["Hyperbolic discounting", "Immediacy bias"],
  source: "Laibson 1997; O'Donoghue & Rabin 1999",
});
