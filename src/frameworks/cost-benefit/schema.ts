import { z } from "zod";

const itemSchema = z.object({
  text: z.string(),
  weight: z.number().min(1).max(9).describe("Relative weight 1–9"),
});

export const schema = z.object({
  framework: z.literal("cost_benefit"),
  category: z.string().describe("The category this framework belongs to"),
  title: z.string().describe("Title summarizing the decision"),
  benefits: z.array(itemSchema).min(1).max(8),
  costs: z.array(itemSchema).min(1).max(8),
  recommendation: z
    .string()
    .describe("Which side carries and why, 2–4 sentences"),
});

export type CostBenefit = z.infer<typeof schema>;
