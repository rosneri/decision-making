import type { FrameworkHelp } from "../help-types";

export const help: FrameworkHelp = {
    expandedName: "LCA — Life-Cycle Assessment",
    whatItIs:
      "Track environmental impact across every stage of a product's life — raw materials, manufacture, transport, use, end-of-life. The biggest stage is your hotspot.",
    howToUse: [
      "Define the functional unit (e.g. '1 km driven', '1 t-shirt worn 50 times').",
      "Map the life-cycle stages: cradle → grave (or cradle-to-cradle if recycled).",
      "Quantify impact at each stage (CO₂e, water, land use…).",
      "The stage with largest impact is the hotspot — focus reduction there. Don't over-optimize a small stage.",
    ],
  };
