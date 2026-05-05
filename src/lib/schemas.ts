import { z } from "zod";

export const DecisionMatrixSchema = z.object({
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

export const EisenhowerSchema = z.object({
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

export const SwotSchema = z.object({
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

export const FrameworkSchema = z.discriminatedUnion("framework", [
  DecisionMatrixSchema,
  EisenhowerSchema,
  SwotSchema,
]);

export type DecisionMatrix = z.infer<typeof DecisionMatrixSchema>;
export type Eisenhower = z.infer<typeof EisenhowerSchema>;
export type Swot = z.infer<typeof SwotSchema>;
export type FrameworkResult = z.infer<typeof FrameworkSchema>;

export const FRAMEWORKS = [
  {
    id: "decision_matrix",
    name: "Decision Matrix",
    blurb:
      "Score each option against weighted criteria. Best for picking between concrete alternatives.",
  },
  {
    id: "eisenhower",
    name: "Eisenhower Matrix",
    blurb:
      "Sort tasks by urgent vs. important. Best when overwhelmed by many things to do.",
  },
  {
    id: "swot",
    name: "SWOT Analysis",
    blurb:
      "Map strengths, weaknesses, opportunities, threats. Best for strategic / open-ended decisions.",
  },
] as const;

export type FrameworkId = (typeof FRAMEWORKS)[number]["id"];
