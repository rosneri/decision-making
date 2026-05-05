import { z } from "zod";


export const meta = {
  id: "model_card",
  name: "Model Card",
  category: "AI alignment",
  blurb: "Document intended use, training data, performance, ethical concerns, and caveats — before release.",
} as const;

export const schema = z.object({
  framework: z.literal("model_card"),
  category: z.string(),
  title: z.string(),
  modelName: z.string(),
  modelMeta: z.string(),
  fields: z.object({
    intendedUse: z.string(),
    outOfScope: z.string(),
    trainingData: z.string(),
    performance: z.string(),
    ethicalConcerns: z.string(),
    caveats: z.string(),
  }),
  recommendation: z.string(),
});
export type ModelCard = z.infer<typeof schema>;

export const sample: ModelCard = {
  framework: "model_card",
  category: meta.category,
  title: "Document the bird-classifier before public release.",
  modelName: "birdsong-cls v0.3",
  modelMeta: "trained 2026-04-19 · ResNet50 · 9.2M params",
  fields: {
    intendedUse: "amateur birders identifying NA species in field recordings",
    outOfScope: "video, non-passerine, anything outside North America",
    trainingData: "Cornell Lab corpus · 412k clips · skewed eastern US 2014–22",
    performance: "top-1 84% · drops to 61% at < -30dB SNR",
    ethicalConcerns: "rare species over-recorded → bias toward common predictions",
    caveats: "do not use for breeding-bird census",
  },
  recommendation: "Publish the card alongside the release. Add a known-failure dataset before next minor version.",
};

export const FIELDS: Array<{ k: keyof ModelCard["fields"]; label: string; accent?: boolean }> = [
  { k: "intendedUse", label: "Intended use" },
  { k: "outOfScope", label: "Out of scope" },
  { k: "trainingData", label: "Training data" },
  { k: "performance", label: "Performance" },
  { k: "ethicalConcerns", label: "Ethical concerns", accent: true },
  { k: "caveats", label: "Caveats" },
];
