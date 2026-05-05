import { z } from "zod";

export const schema = z.object({
  framework: z.literal("decision_matrix"),
  category: z
    .string()
    .describe(
      "The category this framework belongs to, e.g. 'Analysis & evaluation'"
    ),
  title: z.string().describe("Title summarizing the decision"),
  criteria: z
    .array(
      z.object({
        name: z.string(),
        weight: z.number().min(1).max(10).describe("Importance 1-10"),
      })
    )
    .min(2)
    .max(6),
  options: z
    .array(
      z.object({
        name: z.string(),
        scores: z
          .array(z.number().min(0).max(10))
          .describe("One score 0-10 per criterion in the same order"),
      })
    )
    .min(2)
    .max(6),
  recommendation: z
    .string()
    .describe("Which option wins and why, 2-4 sentences"),
});

export type DecisionMatrix = z.infer<typeof schema>;
