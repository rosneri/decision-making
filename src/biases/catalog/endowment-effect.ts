import { defineBias } from "../types";

export const bias = defineBias({
  id: "endowment_effect",
  name: "Endowment effect",
  family: "stability",
  blurb: "Valuing what you already own or built above its market worth.",
  description:
    "Ownership adds value in the eyes of the owner. Sellers ask more than buyers will pay for the same thing, founders price their company above what the numbers support, and people who assembled something themselves rate it higher than an identical purchased one. The bias is strongest for things you made.",
  cues: [
    "Your own asset, product or work valued above comparable ones",
    "Reluctance to sell, trade or replace something at a fair price",
    "Effort invested in making something cited as part of its worth",
  ],
  question: "What would I pay for this if I didn't already have it?",
  counters: [
    "Price the thing as a buyer would, using comparables, before deciding.",
    "Ask what you'd need to be paid to give it up versus what you'd pay to get it; the gap is the bias.",
    "Have a neutral party value it.",
  ],
  antidotes: ["dcf", "batna", "cost_benefit"],
  aka: ["IKEA effect"],
  source: "Thaler 1980; Kahneman, Knetsch & Thaler 1990",
});
