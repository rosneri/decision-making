import type { FrameworkHelp } from "../help-types";

export const help: FrameworkHelp = {
    expandedName: "Wardley Mapping",
    whatItIs:
      "A strategy map: plot every component your business needs on a chart of user-visibility (y) versus how commodified it is (x).",
    howToUse: [
      "Start with the user need at the top.",
      "Below it, draw the chain of capabilities needed to deliver that need.",
      "Place each component along the x-axis: Genesis → Custom-built → Product → Commodity.",
      "Items in 'Genesis/Custom' are where you build differentiation; commodities should be bought, not built.",
      "Identify which components are evolving rightward — that's where the next disruption lands.",
    ],
    glossary: {
      Genesis: "Brand-new, uncertain, novel.",
      Custom: "Built specifically for you; rare.",
      Product: "Off-the-shelf, with multiple vendors.",
      Commodity: "Utility-like, undifferentiated, cheap.",
    },
  };
