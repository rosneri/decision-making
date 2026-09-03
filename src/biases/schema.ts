import { z } from "zod";

// A single bias the model believes may be distorting the user's decision.
// `id` is validated against the catalog after generation (a large enum in
// structured-output mode is rejected upstream, so we accept any string and
// filter). `name` / `family` are filled from the catalog so API consumers
// get a self-describing payload.
export const BiasFindingSchema = z.object({
  id: z.string().describe("bias id from the catalog, snake_case"),
  name: z.string(),
  family: z.string(),
  severity: z.number().int().min(1).max(5)
    .describe("1 = faint hint, 5 = very likely steering the decision"),
  evidence: z.string()
    .describe("what in the user's own words suggests this bias, quoted or closely paraphrased"),
  effect: z.string()
    .describe("how this bias could tilt this specific decision"),
  counter: z.string()
    .describe("one concrete move the user can make to check or offset it"),
  // Set client-side when the user marks the finding as not applicable.
  dismissed: z.boolean().optional(),
});
export type BiasFinding = z.infer<typeof BiasFindingSchema>;

export const BiasFindingsSchema = z.array(BiasFindingSchema);

// What the model returns in the detection stage. `name`/`family` are not
// asked of the model; they're joined from the catalog in normalize().
export const BiasDetectionSchema = z.object({
  biases: z.array(z.object({
    id: z.string().describe("bias id from the catalog, snake_case, exactly as listed"),
    severity: z.number().int().min(1).max(5),
    evidence: z.string(),
    effect: z.string(),
    counter: z.string(),
  })).max(6),
});
export type BiasDetection = z.infer<typeof BiasDetectionSchema>;
