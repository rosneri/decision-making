import type { FrameworkHelp } from "../help-types";

export const help: FrameworkHelp = {
  expandedName: "MoSCoW Prioritization",
  whatItIs:
    "A four-bucket scoping technique from DSDM/Agile: Must-have, Should-have, Could-have, Won't-have-this-time. Forces an explicit budget instead of an open list of 'priorities.'",
  howToUse: [
    "List every candidate item, then file each into exactly one bucket.",
    "Musts: the release fails without them. Aim for ≤60% of effort on Musts so you have slack.",
    "Shoulds and Coulds give you flexibility when scope changes.",
    "Won'ts are essential — they kill scope creep by making out-of-scope explicit.",
  ],
};
