import { z } from "zod";

export const schema = z.object({
  framework: z.literal("swot"),
  category: z
    .string()
    .describe(
      "The category this framework belongs to, e.g. 'Strategy & business'"
    ),
  title: z.string(),
  strengths: z.array(z.string()).min(1).max(6),
  weaknesses: z.array(z.string()).min(1).max(6),
  opportunities: z.array(z.string()).min(1).max(6),
  threats: z.array(z.string()).min(1).max(6),
  recommendation: z
    .string()
    .describe("Strategic recommendation given the SWOT, 2-4 sentences"),
});

export type Swot = z.infer<typeof schema>;
