import type { FrameworkHelp } from "../help-types";

export const help: FrameworkHelp = {
  expandedName: "Zone of Possible Agreement (ZOPA)",
  whatItIs:
    "The range of outcomes both parties could rationally accept. ZOPA exists only if the buyer's max meets or exceeds the seller's min. Without overlap, no deal is possible at price alone.",
  howToUse: [
    "For each side, write the target (preferred) and walk-away (the worst they'll accept).",
    "If buyer-walkaway ≥ seller-walkaway, you have a ZOPA. The midpoint is the natural anchor.",
    "If no ZOPA, the only path is to expand the pie (add non-price terms, change scope).",
    "Use the ZOPA range to plan opening offers, not to reveal your walk-away.",
  ],
};
