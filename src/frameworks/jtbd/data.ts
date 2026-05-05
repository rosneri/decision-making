import { z } from "zod";


export const meta = {
  id: "jtbd",
  name: "Jobs-to-be-Done",
  category: "Product & UX",
  blurb: "When __, I want to __, so I can __ — the job, not the persona.",
} as const;

export const schema = z.object({
  framework: z.literal("jtbd"),
  category: z.string(),
  title: z.string(),
  when: z.string(),
  want: z.string(),
  soThat: z.string(),
  competitors: z.array(z.string()).min(0).max(8),
  recommendation: z.string(),
});
export type Jtbd = z.infer<typeof schema>;

export const sample: Jtbd = {
  framework: "jtbd",
  category: meta.category,
  title: "Why do people buy our protein bars?",
  when: "I'm rushing between meetings",
  want: "to eat something filling without leaving my desk",
  soThat: "I don't crash before 4pm",
  competitors: ["coffee", "granola", "skipping it"],
  recommendation: "Compete on convenience and energy, not protein content. The granola aisle is the real rival.",
};
