import { defineBias } from "../types";

export const bias = defineBias({
  id: "mental_accounting",
  name: "Mental accounting",
  family: "framing",
  blurb: "Treating money or time differently depending on which mental bucket it sits in.",
  description:
    "A bonus gets spent freely while salary is saved; a departmental budget is spent to the line while the same money elsewhere would be scrutinised; a 'free' hour is wasted while a billed one is guarded. The buckets are useful for self-control and misleading for decisions, since money and hours are the same whatever label they carry.",
  cues: [
    "Resources described as belonging to a category that makes them easier or harder to spend ('it's from the bonus', 'use it or lose it')",
    "A cost accepted in one budget that would be rejected in another",
    "Windfalls, refunds or 'found' money treated differently from earned",
  ],
  question: "Would I make this trade if the money came out of my main account?",
  counters: [
    "Restate every cost and benefit in the same unit from a single pool.",
    "Ask what the best use of that money or time is across all your options, not just within the bucket.",
    "Merge budgets on paper for the decision, even if they stay separate in practice.",
  ],
  antidotes: ["budget_503020", "cost_benefit", "eisenhower"],
  source: "Thaler 1985",
});
