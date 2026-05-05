import { z } from "zod";


export const LENSES = ["rational", "organizational", "political"] as const;
export type Lens = (typeof LENSES)[number];

export const meta = {
  id: "allison_lenses",
  name: "Allison's Three Lenses",
  category: "Diplomatic & geopolitical",
  blurb: "Rational actor, organizational process, governmental politics — all happening at once.",
} as const;

export const schema = z.object({
  framework: z.literal("allison_lenses"),
  category: z.string(),
  title: z.string(),
  lenses: z.object({
    rational: z.object({ explanation: z.string(), weight: z.number().int().min(1).max(5) }),
    organizational: z.object({ explanation: z.string(), weight: z.number().int().min(1).max(5) }),
    political: z.object({ explanation: z.string(), weight: z.number().int().min(1).max(5) }),
  }),
  recommendation: z.string(),
});
export type AllisonLenses = z.infer<typeof schema>;

export const sample: AllisonLenses = {
  framework: "allison_lenses",
  category: meta.category,
  title: "Why did the country impose the export ban?",
  lenses: {
    rational: { explanation: "leverage in trade talks", weight: 3 },
    organizational: { explanation: "ministry's standard playbook", weight: 5 },
    political: { explanation: "hardliners won the internal fight", weight: 4 },
  },
  recommendation: "Lens II (organizational) is loudest. Their next move likely follows the same playbook — anticipate it.",
};

export const META: Record<Lens, { roman: string; label: string; q: string }> = {
  rational: { roman: "I", label: "Rational Actor", q: "what's the strategic gain?" },
  organizational: { roman: "II", label: "Organizational", q: "what bureaucratic routine?" },
  political: { roman: "III", label: "Governmental Politics", q: "who won the internal fight?" },
};
