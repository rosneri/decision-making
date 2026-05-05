import { z } from "zod";
import * as decisionMatrix from "./decision-matrix";
import * as eisenhower from "./eisenhower";
import * as swot from "./swot";

export const DecisionMatrixSchema = decisionMatrix.schema;
export const EisenhowerSchema = eisenhower.schema;
export const SwotSchema = swot.schema;

export type DecisionMatrix = decisionMatrix.DecisionMatrix;
export type Eisenhower = eisenhower.Eisenhower;
export type Swot = swot.Swot;

export const FrameworkSchema = z.discriminatedUnion("framework", [
  DecisionMatrixSchema,
  EisenhowerSchema,
  SwotSchema,
]);

export type FrameworkResult = z.infer<typeof FrameworkSchema>;

export const FRAMEWORKS = [
  decisionMatrix.meta,
  eisenhower.meta,
  swot.meta,
] as const;

export type FrameworkId = (typeof FRAMEWORKS)[number]["id"];

export const SAMPLES = {
  decision_matrix: decisionMatrix.sample,
  eisenhower: eisenhower.sample,
  swot: swot.sample,
} satisfies Record<FrameworkId, FrameworkResult>;

export const VIEWS = {
  decision_matrix: decisionMatrix.View,
  eisenhower: eisenhower.View,
  swot: swot.View,
} as const;
