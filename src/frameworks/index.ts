import { z } from "zod";
import * as decisionMatrix from "./decision-matrix";
import * as eisenhower from "./eisenhower";
import * as swot from "./swot";
import * as costBenefit from "./cost-benefit";

export const DecisionMatrixSchema = decisionMatrix.schema;
export const EisenhowerSchema = eisenhower.schema;
export const SwotSchema = swot.schema;
export const CostBenefitSchema = costBenefit.schema;

export type DecisionMatrix = decisionMatrix.DecisionMatrix;
export type Eisenhower = eisenhower.Eisenhower;
export type Swot = swot.Swot;
export type CostBenefit = costBenefit.CostBenefit;

export const FrameworkSchema = z.discriminatedUnion("framework", [
  DecisionMatrixSchema,
  EisenhowerSchema,
  SwotSchema,
  CostBenefitSchema,
]);

export type FrameworkResult = z.infer<typeof FrameworkSchema>;

export const FRAMEWORKS = [
  decisionMatrix.meta,
  costBenefit.meta,
  swot.meta,
  eisenhower.meta,
] as const;

export type FrameworkId = (typeof FRAMEWORKS)[number]["id"];

export const SAMPLES = {
  decision_matrix: decisionMatrix.sample,
  cost_benefit:    costBenefit.sample,
  swot:            swot.sample,
  eisenhower:      eisenhower.sample,
} satisfies Record<FrameworkId, FrameworkResult>;

export const VIEWS = {
  decision_matrix: decisionMatrix.View,
  cost_benefit:    costBenefit.View,
  swot:            swot.View,
  eisenhower:      eisenhower.View,
} as const;
