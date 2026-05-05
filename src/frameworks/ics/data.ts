import { z } from "zod";


export const SECTIONS = ["operations", "planning", "logistics", "finance"] as const;
export type Section = (typeof SECTIONS)[number];

export const meta = {
  id: "ics",
  name: "Incident Command System",
  category: "Crisis & emergency",
  blurb: "Single Incident Commander; four sections; span of control 1:5.",
} as const;

export const schema = z.object({
  framework: z.literal("ics"),
  category: z.string(),
  title: z.string(),
  commander: z.string(),
  sections: z.object({
    operations: z.object({ chief: z.string(), note: z.string() }),
    planning: z.object({ chief: z.string(), note: z.string() }),
    logistics: z.object({ chief: z.string(), note: z.string() }),
    finance: z.object({ chief: z.string(), note: z.string() }),
  }),
  recommendation: z.string(),
});
export type Ics = z.infer<typeof schema>;

export const sample: Ics = {
  framework: "ics",
  category: meta.category,
  title: "Wildfire approaching three towns. Coordinate?",
  commander: "Chief Mendez · IC",
  sections: {
    operations: { chief: "Lt. Park", note: "the fight" },
    planning: { chief: "Capt. Yoon", note: "next 12h" },
    logistics: { chief: "Sgt. Roy", note: "people · stuff" },
    finance: { chief: "Garza", note: "the bill" },
  },
  recommendation: "All four section chiefs identified. Confirm operations divides A/B by quadrant before next briefing.",
};

export const META: Record<Section, { label: string }> = {
  operations: { label: "Operations" },
  planning: { label: "Planning" },
  logistics: { label: "Logistics" },
  finance: { label: "Finance" },
};
