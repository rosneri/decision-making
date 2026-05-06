import { z } from "zod";

export const meta = {
  id: "nine_box",
  name: "9-Box Talent Grid",
  category: "Hiring & talent",
  blurb: "Plot people on Performance × Potential. Invest, develop, or move them out.",
} as const;

export const schema = z.object({
  framework: z.literal("nine_box"),
  category: z.string(),
  title: z.string(),
  people: z.array(z.object({
    name: z.string(),
    role: z.string(),
    performance: z.number().int().min(0).max(2),
    potential: z.number().int().min(0).max(2),
    note: z.string(),
  })).min(1).max(20),
  recommendation: z.string(),
});
export type NineBox = z.infer<typeof schema>;

export const sample: NineBox = {
  framework: "nine_box",
  category: meta.category,
  title: "Engineering team Q3 talent review",
  people: [
    { name: "Ada", role: "Staff Eng", performance: 2, potential: 2, note: "Promotion candidate; expand scope" },
    { name: "Ben", role: "Senior Eng", performance: 2, potential: 1, note: "Solid IC; consider depth track" },
    { name: "Cleo", role: "Junior Eng", performance: 0, potential: 2, note: "High ceiling; needs coaching" },
    { name: "Dan", role: "Eng", performance: 1, potential: 1, note: "Steady; ready for stretch project" },
    { name: "Eli", role: "Senior Eng", performance: 0, potential: 0, note: "Sustained miss; PIP or exit" },
  ],
  recommendation: "Ada is your lever — promote and load. Cleo deserves coaching investment. Eli needs a hard conversation.",
};

export const LABELS = [
  ["Risk", "Inconsistent", "Diamond"],
  ["Solid Pro", "Core", "Future Star"],
  ["Trusted Pro", "High Pro", "Star"],
];

export function getMetrics(d: NineBox) {
  const stars = d.people.filter((p) => p.performance === 2 && p.potential === 2).length;
  const risk = d.people.filter((p) => p.performance === 0 && p.potential === 0).length;
  return [
    { k: "Stars", v: String(stars) },
    { k: "Risk", v: String(risk) },
    { k: "Total", v: String(d.people.length) },
  ];
}
