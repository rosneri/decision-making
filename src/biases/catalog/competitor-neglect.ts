import { defineBias } from "../types";

export const bias = defineBias({
  id: "competitor_neglect",
  name: "Competitor neglect",
  family: "action",
  blurb: "Planning as if the other players will stand still.",
  description:
    "Forecasts assume rivals, counterparties or the environment won't respond to your move. They will. Prices get matched, hiring gets contested, the other side of the negotiation has its own plan. Decisions that ignore the reaction look far better on paper than in practice.",
  cues: [
    "No mention of how competitors, the other party or the market will respond",
    "Market-share or win-rate assumptions that don't subtract someone else's",
    "Strategy described as if the field were empty",
  ],
  question: "If I were the other side, what would I do the day after I make this move?",
  counters: [
    "Write the decision from the competitor's or counterparty's point of view.",
    "Assume the most capable rival copies or counters your move within a year; does the plan still work?",
    "War-game the second move, not just the first.",
  ],
  antidotes: ["nash", "five_forces", "second_order"],
  source: "Camerer & Lovallo 1999",
});
