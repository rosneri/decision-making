import { z } from "zod";

export const schema = z.object({
  framework: z.literal("eisenhower"),
  category: z
    .string()
    .describe(
      "The category this framework belongs to, e.g. 'Speed & prioritization'"
    ),
  title: z.string(),
  tasks: z
    .array(
      z.object({
        text: z.string(),
        urgent: z.boolean(),
        important: z.boolean(),
      })
    )
    .min(3)
    .max(12),
  recommendation: z
    .string()
    .describe("Prioritized plan referencing each quadrant, 2-5 sentences"),
});

export type Eisenhower = z.infer<typeof schema>;
