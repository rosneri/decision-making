import { z } from "zod";

// The four originally-implemented frameworks already split each concern into
// its own file (meta.ts / schema.ts / sample.ts / view.tsx) with a server-safe
// `index.ts` re-export, so we can import their namespace directly.
import * as decisionMatrix from "./decision-matrix";
import * as eisenhower from "./eisenhower";
import * as swot from "./swot";
import * as costBenefit from "./cost-benefit";

// The remaining frameworks each ship a `data.ts` (server-safe — meta, schema,
// sample, type) plus an `index.tsx` (client — exports `View`). Importing meta
// & schema directly from a "use client" module yields client references with
// `undefined` runtime values on the server, so we must reach `./data` here.
import * as firstPrinciplesData from "./first-principles/data";
import * as inversionData from "./inversion/data";
import * as riceData from "./rice/data";
import * as rapidData from "./rapid/data";
import * as sixHatsData from "./six-hats/data";
import * as fiveForcesData from "./five-forces/data";
import * as wardleyData from "./wardley/data";
import * as jtbdData from "./jtbd/data";
import * as kanoData from "./kano/data";
import * as referenceClassData from "./reference-class/data";
import * as monteCarloData from "./monte-carlo/data";
import * as batnaData from "./batna/data";
import * as titForTatData from "./tit-for-tat/data";
import * as wrapData from "./wrap/data";
import * as preMortemData from "./pre-mortem/data";
import * as pdcaData from "./pdca/data";
import * as fiveWhysData from "./five-whys/data";
import * as veilOfIgnoranceData from "./veil-of-ignorance/data";
import * as markkulaData from "./markkula/data";
import * as sdmData from "./sdm/data";
import * as gradeData from "./grade/data";
import * as iracData from "./irac/data";
import * as learnedHandData from "./learned-hand/data";
import * as oodaData from "./ooda/data";
import * as achData from "./ach/data";
import * as dcfData from "./dcf/data";
import * as kellyData from "./kelly/data";
import * as structuredInterviewData from "./structured-interview/data";
import * as scorecardData from "./scorecard/data";
import * as odysseyData from "./odyssey/data";
import * as regretMinData from "./regret-min/data";
import * as adrData from "./adr/data";
import * as pughData from "./pugh/data";
import * as crossValidationData from "./cross-validation/data";
import * as costSensitiveData from "./cost-sensitive/data";
import * as qalyData from "./qaly/data";
import * as riaData from "./ria/data";
import * as lcaData from "./lca/data";
import * as doughnutData from "./doughnut/data";
import * as rpdData from "./rpd/data";
import * as icsData from "./ics/data";
import * as allisonLensesData from "./allison-lenses/data";
import * as deterrenceData from "./deterrence/data";
import * as designThinkingData from "./design-thinking/data";
import * as leanData from "./lean/data";
import * as meddicData from "./meddic/data";
import * as stpData from "./stp/data";
import * as harvardNegotiationData from "./harvard-negotiation/data";
import * as tkiData from "./tki/data";
import * as budget503020Data from "./budget-503020/data";
import * as sunkCostData from "./sunk-cost/data";
import * as wpaData from "./wpa/data";
import * as pythagoreanData from "./pythagorean/data";
import * as algoImpactData from "./algo-impact/data";
import * as modelCardData from "./model-card/data";
import * as stoicData from "./stoic/data";
import * as ignatianData from "./ignatian/data";

// View imports — these are client references but VIEWS is only consumed
// during client-side rendering of the per-framework editor.
import { View as FirstPrinciplesView } from "./first-principles";
import { View as InversionView } from "./inversion";
import { View as RiceView } from "./rice";
import { View as RapidView } from "./rapid";
import { View as SixHatsView } from "./six-hats";
import { View as FiveForcesView } from "./five-forces";
import { View as WardleyView } from "./wardley";
import { View as JtbdView } from "./jtbd";
import { View as KanoView } from "./kano";
import { View as ReferenceClassView } from "./reference-class";
import { View as MonteCarloView } from "./monte-carlo";
import { View as BatnaView } from "./batna";
import { View as TitForTatView } from "./tit-for-tat";
import { View as WrapView } from "./wrap";
import { View as PreMortemView } from "./pre-mortem";
import { View as PdcaView } from "./pdca";
import { View as FiveWhysView } from "./five-whys";
import { View as VeilOfIgnoranceView } from "./veil-of-ignorance";
import { View as MarkkulaView } from "./markkula";
import { View as SdmView } from "./sdm";
import { View as GradeView } from "./grade";
import { View as IracView } from "./irac";
import { View as LearnedHandView } from "./learned-hand";
import { View as OodaView } from "./ooda";
import { View as AchView } from "./ach";
import { View as DcfView } from "./dcf";
import { View as KellyView } from "./kelly";
import { View as StructuredInterviewView } from "./structured-interview";
import { View as ScorecardView } from "./scorecard";
import { View as OdysseyView } from "./odyssey";
import { View as RegretMinView } from "./regret-min";
import { View as AdrView } from "./adr";
import { View as PughView } from "./pugh";
import { View as CrossValidationView } from "./cross-validation";
import { View as CostSensitiveView } from "./cost-sensitive";
import { View as QalyView } from "./qaly";
import { View as RiaView } from "./ria";
import { View as LcaView } from "./lca";
import { View as DoughnutView } from "./doughnut";
import { View as RpdView } from "./rpd";
import { View as IcsView } from "./ics";
import { View as AllisonLensesView } from "./allison-lenses";
import { View as DeterrenceView } from "./deterrence";
import { View as DesignThinkingView } from "./design-thinking";
import { View as LeanView } from "./lean";
import { View as MeddicView } from "./meddic";
import { View as StpView } from "./stp";
import { View as HarvardNegotiationView } from "./harvard-negotiation";
import { View as TkiView } from "./tki";
import { View as Budget503020View } from "./budget-503020";
import { View as SunkCostView } from "./sunk-cost";
import { View as WpaView } from "./wpa";
import { View as PythagoreanView } from "./pythagorean";
import { View as AlgoImpactView } from "./algo-impact";
import { View as ModelCardView } from "./model-card";
import { View as StoicView } from "./stoic";
import { View as IgnatianView } from "./ignatian";

// Helper: combine server-safe data namespace with the client View into a
// single record so downstream code sees the same shape as the four originally
// split frameworks.
function bundle<D extends { meta: unknown; schema: unknown; sample: unknown }>(
  data: D,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  View: (props: { data: any; onUpdate?: (d: any) => void }) => React.ReactNode,
) {
  return { ...data, View };
}

const firstPrinciples       = bundle(firstPrinciplesData,       FirstPrinciplesView);
const inversion             = bundle(inversionData,             InversionView);
const rice                  = bundle(riceData,                  RiceView);
const rapid                 = bundle(rapidData,                 RapidView);
const sixHats               = bundle(sixHatsData,               SixHatsView);
const fiveForces            = bundle(fiveForcesData,            FiveForcesView);
const wardley               = bundle(wardleyData,               WardleyView);
const jtbd                  = bundle(jtbdData,                  JtbdView);
const kano                  = bundle(kanoData,                  KanoView);
const referenceClass        = bundle(referenceClassData,        ReferenceClassView);
const monteCarlo            = bundle(monteCarloData,            MonteCarloView);
const batna                 = bundle(batnaData,                 BatnaView);
const titForTat             = bundle(titForTatData,             TitForTatView);
const wrap                  = bundle(wrapData,                  WrapView);
const preMortem             = bundle(preMortemData,             PreMortemView);
const pdca                  = bundle(pdcaData,                  PdcaView);
const fiveWhys              = bundle(fiveWhysData,              FiveWhysView);
const veilOfIgnorance       = bundle(veilOfIgnoranceData,       VeilOfIgnoranceView);
const markkula              = bundle(markkulaData,              MarkkulaView);
const sdm                   = bundle(sdmData,                   SdmView);
const grade                 = bundle(gradeData,                 GradeView);
const irac                  = bundle(iracData,                  IracView);
const learnedHand           = bundle(learnedHandData,           LearnedHandView);
const ooda                  = bundle(oodaData,                  OodaView);
const ach                   = bundle(achData,                   AchView);
const dcf                   = bundle(dcfData,                   DcfView);
const kelly                 = bundle(kellyData,                 KellyView);
const structuredInterview   = bundle(structuredInterviewData,   StructuredInterviewView);
const scorecard             = bundle(scorecardData,             ScorecardView);
const odyssey               = bundle(odysseyData,               OdysseyView);
const regretMin             = bundle(regretMinData,             RegretMinView);
const adr                   = bundle(adrData,                   AdrView);
const pugh                  = bundle(pughData,                  PughView);
const crossValidation       = bundle(crossValidationData,       CrossValidationView);
const costSensitive         = bundle(costSensitiveData,         CostSensitiveView);
const qaly                  = bundle(qalyData,                  QalyView);
const ria                   = bundle(riaData,                   RiaView);
const lca                   = bundle(lcaData,                   LcaView);
const doughnut              = bundle(doughnutData,              DoughnutView);
const rpd                   = bundle(rpdData,                   RpdView);
const ics                   = bundle(icsData,                   IcsView);
const allisonLenses         = bundle(allisonLensesData,         AllisonLensesView);
const deterrence            = bundle(deterrenceData,            DeterrenceView);
const designThinking        = bundle(designThinkingData,        DesignThinkingView);
const lean                  = bundle(leanData,                  LeanView);
const meddic                = bundle(meddicData,                MeddicView);
const stp                   = bundle(stpData,                   StpView);
const harvardNegotiation    = bundle(harvardNegotiationData,    HarvardNegotiationView);
const tki                   = bundle(tkiData,                   TkiView);
const budget503020          = bundle(budget503020Data,          Budget503020View);
const sunkCost              = bundle(sunkCostData,              SunkCostView);
const wpa                   = bundle(wpaData,                   WpaView);
const pythagorean           = bundle(pythagoreanData,           PythagoreanView);
const algoImpact            = bundle(algoImpactData,            AlgoImpactView);
const modelCard             = bundle(modelCardData,             ModelCardView);
const stoic                 = bundle(stoicData,                 StoicView);
const ignatian              = bundle(ignatianData,              IgnatianView);

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

// Per-framework schema lookup for two-stage AI generation.
export const SCHEMAS = Object.fromEntries(
  ALL.map((m) => [m.meta.id, m.schema])
) as unknown as Record<FrameworkId, z.ZodTypeAny>;
