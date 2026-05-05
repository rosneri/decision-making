import { meta } from "./meta";
import type { Swot } from "./schema";

export const sample: Swot = {
  framework: "swot",
  category: meta.category,
  title: "Launching a side project",
  strengths: ["Strong domain expertise", "Existing audience", "Low overhead"],
  weaknesses: ["Limited time outside day job", "No co-founder"],
  opportunities: ["Growing market", "AI tooling cuts dev time", "No major incumbent"],
  threats: ["Competitors well funded", "Platform policy changes"],
  recommendation:
    "Lean into your audience and ship a thin v1 fast. Keep scope small enough to fit nights/weekends until traction justifies more.",
};
