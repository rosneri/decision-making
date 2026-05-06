import { z } from "zod";

export const INSTRUMENTS = ["Diplomatic", "Information", "Military", "Economic"] as const;
export type Instrument = (typeof INSTRUMENTS)[number];

export const meta = {
  id: "dime",
  name: "DIME",
  category: "Diplomatic & geopolitical",
  blurb: "Diplomatic · Information · Military · Economic — the four levers of state power.",
} as const;

export const schema = z.object({
  framework: z.literal("dime"),
  category: z.string(),
  title: z.string(),
  objective: z.string(),
  instruments: z.object({
    Diplomatic: z.array(z.string()).min(1).max(8),
    Information: z.array(z.string()).min(1).max(8),
    Military: z.array(z.string()).min(1).max(8),
    Economic: z.array(z.string()).min(1).max(8),
  }),
  emphasis: z.enum(INSTRUMENTS),
  recommendation: z.string(),
});
export type Dime = z.infer<typeof schema>;

export const sample: Dime = {
  framework: "dime",
  category: meta.category,
  title: "Respond to a treaty violation",
  objective: "Reverse the violation without escalating to kinetic conflict",
  instruments: {
    Diplomatic: ["Joint demarche with G7 partners", "UNSC statement"],
    Information: ["Declassify intel showing intent", "Coordinated press briefings"],
    Military: ["Reposition forces to signal resolve", "Joint exercises with allies"],
    Economic: ["Targeted sanctions on regime financiers", "Asset freeze"],
  },
  emphasis: "Economic",
  recommendation: "Lead with Economic + Diplomatic; hold Military as a credible signal, not first move.",
};

export function getMetrics(d: Dime) {
  const total = INSTRUMENTS.reduce((n, k) => n + d.instruments[k].length, 0);
  return [
    { k: "Lead", v: d.emphasis },
    { k: "Actions", v: String(total) },
  ];
}
