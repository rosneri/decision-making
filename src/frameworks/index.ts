import { z } from "zod";

import * as decisionMatrix from "./decision-matrix";
import * as eisenhower from "./eisenhower";
import * as swot from "./swot";
import * as costBenefit from "./cost-benefit";
import * as firstPrinciples from "./first-principles";
import * as inversion from "./inversion";
import * as rice from "./rice";
import * as rapid from "./rapid";
import * as sixHats from "./six-hats";
import * as fiveForces from "./five-forces";
import * as wardley from "./wardley";
import * as jtbd from "./jtbd";
import * as kano from "./kano";
import * as referenceClass from "./reference-class";
import * as monteCarlo from "./monte-carlo";
import * as batna from "./batna";
import * as titForTat from "./tit-for-tat";
import * as wrap from "./wrap";
import * as preMortem from "./pre-mortem";
import * as pdca from "./pdca";
import * as fiveWhys from "./five-whys";
import * as veilOfIgnorance from "./veil-of-ignorance";
import * as markkula from "./markkula";
import * as sdm from "./sdm";
import * as grade from "./grade";
import * as irac from "./irac";
import * as learnedHand from "./learned-hand";
import * as ooda from "./ooda";
import * as ach from "./ach";
import * as dcf from "./dcf";
import * as kelly from "./kelly";
import * as structuredInterview from "./structured-interview";
import * as scorecard from "./scorecard";
import * as odyssey from "./odyssey";
import * as regretMin from "./regret-min";
import * as adr from "./adr";
import * as pugh from "./pugh";
import * as crossValidation from "./cross-validation";
import * as costSensitive from "./cost-sensitive";
import * as qaly from "./qaly";
import * as ria from "./ria";
import * as lca from "./lca";
import * as doughnut from "./doughnut";
import * as rpd from "./rpd";
import * as ics from "./ics";
import * as allisonLenses from "./allison-lenses";
import * as deterrence from "./deterrence";
import * as designThinking from "./design-thinking";
import * as lean from "./lean";
import * as meddic from "./meddic";
import * as stp from "./stp";
import * as harvardNegotiation from "./harvard-negotiation";
import * as tki from "./tki";
import * as budget503020 from "./budget-503020";
import * as sunkCost from "./sunk-cost";
import * as wpa from "./wpa";
import * as pythagorean from "./pythagorean";
import * as algoImpact from "./algo-impact";
import * as modelCard from "./model-card";
import * as stoic from "./stoic";
import * as ignatian from "./ignatian";

// Re-exports for the four originally implemented frameworks (kept stable
// because the AI-flow API and existing tests depend on them).
export const DecisionMatrixSchema = decisionMatrix.schema;
export const EisenhowerSchema = eisenhower.schema;
export const SwotSchema = swot.schema;
export const CostBenefitSchema = costBenefit.schema;

export type DecisionMatrix = decisionMatrix.DecisionMatrix;
export type Eisenhower = eisenhower.Eisenhower;
export type Swot = swot.Swot;
export type CostBenefit = costBenefit.CostBenefit;

const ALL = [
  decisionMatrix, costBenefit, swot, eisenhower,
  firstPrinciples, inversion,
  rice, rapid, sixHats,
  fiveForces, wardley,
  jtbd, kano,
  referenceClass, monteCarlo,
  batna, titForTat,
  wrap, preMortem,
  pdca, fiveWhys,
  veilOfIgnorance, markkula,
  sdm, grade,
  irac, learnedHand,
  ooda, ach,
  dcf, kelly,
  structuredInterview, scorecard,
  odyssey, regretMin,
  adr, pugh,
  crossValidation, costSensitive,
  qaly, ria,
  lca, doughnut,
  rpd, ics,
  allisonLenses, deterrence,
  designThinking, lean,
  meddic, stp,
  harvardNegotiation, tki,
  budget503020, sunkCost,
  wpa, pythagorean,
  algoImpact, modelCard,
  stoic, ignatian,
] as const;

export const FrameworkSchema = z.discriminatedUnion("framework", [
  decisionMatrix.schema,
  eisenhower.schema,
  swot.schema,
  costBenefit.schema,
  firstPrinciples.schema,
  inversion.schema,
  rice.schema,
  rapid.schema,
  sixHats.schema,
  fiveForces.schema,
  wardley.schema,
  jtbd.schema,
  kano.schema,
  referenceClass.schema,
  monteCarlo.schema,
  batna.schema,
  titForTat.schema,
  wrap.schema,
  preMortem.schema,
  pdca.schema,
  fiveWhys.schema,
  veilOfIgnorance.schema,
  markkula.schema,
  sdm.schema,
  grade.schema,
  irac.schema,
  learnedHand.schema,
  ooda.schema,
  ach.schema,
  dcf.schema,
  kelly.schema,
  structuredInterview.schema,
  scorecard.schema,
  odyssey.schema,
  regretMin.schema,
  adr.schema,
  pugh.schema,
  crossValidation.schema,
  costSensitive.schema,
  qaly.schema,
  ria.schema,
  lca.schema,
  doughnut.schema,
  rpd.schema,
  ics.schema,
  allisonLenses.schema,
  deterrence.schema,
  designThinking.schema,
  lean.schema,
  meddic.schema,
  stp.schema,
  harvardNegotiation.schema,
  tki.schema,
  budget503020.schema,
  sunkCost.schema,
  wpa.schema,
  pythagorean.schema,
  algoImpact.schema,
  modelCard.schema,
  stoic.schema,
  ignatian.schema,
]);

export type FrameworkResult = z.infer<typeof FrameworkSchema>;

export const FRAMEWORKS = ALL.map((m) => m.meta);
export type FrameworkId = FrameworkResult["framework"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyView = (props: { data: any; onUpdate?: (d: any) => void }) => React.ReactNode;

export const SAMPLES = Object.fromEntries(
  ALL.map((m) => [m.meta.id, m.sample])
) as unknown as Record<FrameworkId, FrameworkResult>;

export const VIEWS = Object.fromEntries(
  ALL.map((m) => [m.meta.id, m.View])
) as unknown as Record<FrameworkId, AnyView>;
