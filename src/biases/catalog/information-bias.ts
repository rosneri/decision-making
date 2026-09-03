import { defineBias } from "../types";

export const bias = defineBias({
  id: "information_bias",
  name: "Information bias",
  family: "framing",
  blurb: "Seeking more information even when it wouldn't change the decision.",
  description:
    "Gathering data feels responsible and postpones the discomfort of choosing. But information has value only if some result would lead to a different action. Much research, testing and consultation before a decision is really deferral in a lab coat, and the delay has costs of its own.",
  cues: [
    "A request for more analysis with no statement of what result would change the choice",
    "Repeated rounds of research on a decision already leaning clearly one way",
    "'We need more data' as the outcome of every discussion",
  ],
  question: "What result from this research would make me choose differently?",
  counters: [
    "Before gathering anything, write down what finding would flip the decision; if nothing would, decide now.",
    "Estimate the cost of delay against the value of what you'd learn.",
    "Set a deadline and decide on what you have.",
  ],
  antidotes: ["ooda", "wrap", "lean"],
  aka: ["Analysis paralysis"],
  source: "Baron, Beattie & Hershey 1988",
});
