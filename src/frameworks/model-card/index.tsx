"use client";
import { useState } from "react";
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

const FIELDS: Array<{ k: keyof ModelCard["fields"]; label: string; accent?: boolean }> = [
  { k: "intendedUse", label: "Intended use" },
  { k: "outOfScope", label: "Out of scope" },
  { k: "trainingData", label: "Training data" },
  { k: "performance", label: "Performance" },
  { k: "ethicalConcerns", label: "Ethical concerns", accent: true },
  { k: "caveats", label: "Caveats" },
];

export function View({ data, onUpdate }: { data: ModelCard; onUpdate?: (d: ModelCard) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: ModelCard) => { setS(n); onUpdate?.(n); };
  const set = (k: keyof ModelCard["fields"], v: string) =>
    upd({ ...s, fields: { ...s.fields, [k]: v } });

  return (
    <div className="border border-ink bg-paper">
      <div className="p-4 border-b border-vermilion bg-vermilion/5">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-vermilion font-medium">Model</span>
        <input value={s.modelName} onChange={(e) => upd({ ...s, modelName: e.target.value })}
          data-testid="mc-model-name"
          className="block w-full mt-1 font-serif font-medium text-[20px] bg-transparent border-none outline-none text-ink" />
        <input value={s.modelMeta} onChange={(e) => upd({ ...s, modelMeta: e.target.value })}
          className="block w-full mt-1 font-serif italic text-[13px] text-ink-muted bg-transparent border-none outline-none" />
      </div>
      <ul className="divide-y divide-rule">
        {FIELDS.map((f) => (
          <li key={f.k} data-testid={`mc-${f.k}`} className={`p-3 ${f.accent ? "bg-vermilion/5" : ""}`}>
            <span className={`font-code text-[10px] tracking-[0.22em] uppercase font-medium ${f.accent ? "text-vermilion" : "text-ink-muted"}`}>{f.label}</span>
            <textarea value={s.fields[f.k]} onChange={(e) => set(f.k, e.target.value)}
              className={`block w-full mt-1 font-serif text-[14px] bg-transparent border-l-2 border-rule pl-3 outline-none focus:border-vermilion resize-none ${f.accent ? "text-vermilion" : "text-ink"}`}
              rows={2} />
          </li>
        ))}
      </ul>
    </div>
  );
}
