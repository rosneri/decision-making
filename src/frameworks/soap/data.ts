import { z } from "zod";

export const SECTIONS = ["S", "O", "A", "P"] as const;
export type Section = (typeof SECTIONS)[number];

export const meta = {
  id: "soap",
  name: "SOAP Notes",
  category: "Medical & clinical",
  blurb: "Subjective · Objective · Assessment · Plan. The standard clinical encounter note.",
} as const;

export const schema = z.object({
  framework: z.literal("soap"),
  category: z.string(),
  title: z.string(),
  patient: z.string(),
  subjective: z.string(),
  objective: z.string(),
  assessment: z.string(),
  plan: z.array(z.string()).min(1).max(8),
  recommendation: z.string(),
});
export type Soap = z.infer<typeof schema>;

export const sample: Soap = {
  framework: "soap",
  category: meta.category,
  title: "47F · chest pain workup",
  patient: "47F, no significant cardiac history, presents with substernal pressure",
  subjective: "Substernal chest pressure x 2h, radiates to left arm, dyspnea, diaphoresis. No prior episodes. Smoker, 15 pack-yrs.",
  objective: "BP 148/92, HR 102, SpO2 97% RA. ECG: 1mm ST depression in V4–V6. Trop I 0.04 (>0.03 cutoff).",
  assessment: "NSTEMI — moderate-risk per HEART score (5).",
  plan: [
    "ASA 325mg PO, ticagrelor load 180mg",
    "Atorvastatin 80mg, metoprolol 25mg PO",
    "Heparin gtt per weight protocol",
    "Cardiology consult for cath within 24h",
    "Serial troponins q3h",
  ],
  recommendation: "Admit telemetry; cath within 24h. Reassess after second troponin.",
};

export const META: Record<Section, { word: string; q: string }> = {
  S: { word: "Subjective", q: "what the patient reports" },
  O: { word: "Objective", q: "exam, labs, imaging" },
  A: { word: "Assessment", q: "diagnosis or differential" },
  P: { word: "Plan", q: "next actions" },
};

export function getMetrics(d: Soap) {
  return [
    { k: "Plan items", v: String(d.plan.length) },
  ];
}
