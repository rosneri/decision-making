import { z } from "zod";


export const meta = {
  id: "stp",
  name: "STP",
  category: "Sales & marketing",
  blurb: "Segment, Target, Position — pick a slice and earn a place in their head.",
} as const;

export const schema = z.object({
  framework: z.literal("stp"),
  category: z.string(),
  title: z.string(),
  segments: z.array(z.string()).min(1).max(8),
  targetIdx: z.number().int().min(0),
  position: z.string(),
  recommendation: z.string(),
});
export type Stp = z.infer<typeof schema>;

export const sample: Stp = {
  framework: "stp",
  category: meta.category,
  title: "Who is the new pour-over coffee actually for?",
  segments: ["commuters", "home brewers", "hobbyist baristas", "offices"],
  targetIdx: 2,
  position: "single-origin from the farm we visit twice a year — not from the auction floor.",
  recommendation: "Target hobbyist baristas first. Position on provenance, not roast level. Channel: IG + 3-Wave shows.",
};
