import { defineBias } from "../types";

export const bias = defineBias({
  id: "groupthink",
  name: "Groupthink",
  family: "social",
  blurb: "A group converging on agreement before it has examined the alternatives.",
  description:
    "Cohesive groups value harmony, and dissent costs harmony, so doubts stay unspoken and the emerging consensus hardens fast. Everyone assumes someone else has checked. Meetings end with a decision that no individual would have made alone with the same information.",
  cues: [
    "'We all agreed' with no record of who argued against",
    "A fast, unanimous decision on a hard question",
    "Dissenters absent, quiet or described as not being team players",
  ],
  question: "Who argued against this, and what did they say?",
  counters: [
    "Assign someone to argue the opposite case before the meeting, and thank them for it.",
    "Collect views in writing, independently, before any discussion.",
    "Have the most senior person speak last.",
  ],
  antidotes: ["six_hats", "pre_mortem", "daci"],
  source: "Janis 1972",
});
