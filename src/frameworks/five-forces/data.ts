import { z } from "zod";


export const FORCES = ["rivalry", "newEntrants", "suppliers", "buyers", "substitutes"] as const;
export type Force = (typeof FORCES)[number];

export const meta = {
  id: "five_forces",
  name: "Porter's Five Forces",
  category: "Strategy & business",
  blurb: "Five pressures decide how attractive a market really is.",
} as const;

export const schema = z.object({
  framework: z.literal("five_forces"),
  category: z.string(),
  title: z.string(),
  forces: z.object({
    rivalry: z.object({ level: z.number().int().min(1).max(5), note: z.string() }),
    newEntrants: z.object({ level: z.number().int().min(1).max(5), note: z.string() }),
    suppliers: z.object({ level: z.number().int().min(1).max(5), note: z.string() }),
    buyers: z.object({ level: z.number().int().min(1).max(5), note: z.string() }),
    substitutes: z.object({ level: z.number().int().min(1).max(5), note: z.string() }),
  }),
  recommendation: z.string(),
});
export type FiveForces = z.infer<typeof schema>;

export const sample: FiveForces = {
  framework: "five_forces",
  category: meta.category,
  title: "How attractive is the streaming-audio market?",
  forces: {
    rivalry: { level: 4, note: "3 majors, price war forming" },
    newEntrants: { level: 2, note: "high content cost, label deals scarce" },
    suppliers: { level: 3, note: "labels concentrated, demand royalties" },
    buyers: { level: 4, note: "low switching cost between apps" },
    substitutes: { level: 2, note: "podcasts, YouTube, radio" },
  },
  recommendation: "Buyers are your real risk. Lock in with playlists and social — not features competitors will clone.",
};

export const FORCE_META: Record<Force, { label: string }> = {
  rivalry: { label: "Industry rivalry" },
  newEntrants: { label: "New entrants" },
  suppliers: { label: "Supplier power" },
  buyers: { label: "Buyer power" },
  substitutes: { label: "Substitutes" },
};
