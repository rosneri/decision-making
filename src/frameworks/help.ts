// Aggregator for per-framework help guides. The actual content lives next
// to each framework in src/frameworks/<id>/help.ts. Kept here as a single
// lookup so the result screen can render the guide for any framework.

export type { FrameworkHelp } from "./help-types";
import type { FrameworkHelp } from "./help-types";

import { help as decisionMatrixHelp } from "./decision-matrix/help";
import { help as eisenhowerHelp } from "./eisenhower/help";
import { help as swotHelp } from "./swot/help";
import { help as costBenefitHelp } from "./cost-benefit/help";
import { help as firstPrinciplesHelp } from "./first-principles/help";
import { help as inversionHelp } from "./inversion/help";
import { help as riceHelp } from "./rice/help";
import { help as rapidHelp } from "./rapid/help";
import { help as sixHatsHelp } from "./six-hats/help";
import { help as fiveForcesHelp } from "./five-forces/help";
import { help as wardleyHelp } from "./wardley/help";
import { help as jtbdHelp } from "./jtbd/help";
import { help as kanoHelp } from "./kano/help";
import { help as referenceClassHelp } from "./reference-class/help";
import { help as monteCarloHelp } from "./monte-carlo/help";
import { help as batnaHelp } from "./batna/help";
import { help as titForTatHelp } from "./tit-for-tat/help";
import { help as wrapHelp } from "./wrap/help";
import { help as preMortemHelp } from "./pre-mortem/help";
import { help as pdcaHelp } from "./pdca/help";
import { help as fiveWhysHelp } from "./five-whys/help";
import { help as veilOfIgnoranceHelp } from "./veil-of-ignorance/help";
import { help as markkulaHelp } from "./markkula/help";
import { help as sdmHelp } from "./sdm/help";
import { help as gradeHelp } from "./grade/help";
import { help as iracHelp } from "./irac/help";
import { help as learnedHandHelp } from "./learned-hand/help";
import { help as oodaHelp } from "./ooda/help";
import { help as achHelp } from "./ach/help";
import { help as dcfHelp } from "./dcf/help";
import { help as kellyHelp } from "./kelly/help";
import { help as structuredInterviewHelp } from "./structured-interview/help";
import { help as scorecardHelp } from "./scorecard/help";
import { help as odysseyHelp } from "./odyssey/help";
import { help as regretMinHelp } from "./regret-min/help";
import { help as adrHelp } from "./adr/help";
import { help as pughHelp } from "./pugh/help";
import { help as crossValidationHelp } from "./cross-validation/help";
import { help as costSensitiveHelp } from "./cost-sensitive/help";
import { help as qalyHelp } from "./qaly/help";
import { help as riaHelp } from "./ria/help";
import { help as lcaHelp } from "./lca/help";
import { help as doughnutHelp } from "./doughnut/help";
import { help as rpdHelp } from "./rpd/help";
import { help as icsHelp } from "./ics/help";
import { help as allisonLensesHelp } from "./allison-lenses/help";
import { help as deterrenceHelp } from "./deterrence/help";
import { help as designThinkingHelp } from "./design-thinking/help";
import { help as leanHelp } from "./lean/help";
import { help as meddicHelp } from "./meddic/help";
import { help as stpHelp } from "./stp/help";
import { help as harvardNegotiationHelp } from "./harvard-negotiation/help";
import { help as tkiHelp } from "./tki/help";
import { help as budget503020Help } from "./budget-503020/help";
import { help as sunkCostHelp } from "./sunk-cost/help";
import { help as wpaHelp } from "./wpa/help";
import { help as pythagoreanHelp } from "./pythagorean/help";
import { help as algoImpactHelp } from "./algo-impact/help";
import { help as modelCardHelp } from "./model-card/help";
import { help as stoicHelp } from "./stoic/help";
import { help as ignatianHelp } from "./ignatian/help";

export const HELP: Record<string, FrameworkHelp> = {
  "decision_matrix": decisionMatrixHelp,
  eisenhower: eisenhowerHelp,
  swot: swotHelp,
  "cost_benefit": costBenefitHelp,
  "first_principles": firstPrinciplesHelp,
  inversion: inversionHelp,
  rice: riceHelp,
  rapid: rapidHelp,
  "six_hats": sixHatsHelp,
  "five_forces": fiveForcesHelp,
  wardley: wardleyHelp,
  jtbd: jtbdHelp,
  kano: kanoHelp,
  "reference_class": referenceClassHelp,
  "monte_carlo": monteCarloHelp,
  batna: batnaHelp,
  "tit_for_tat": titForTatHelp,
  wrap: wrapHelp,
  "pre_mortem": preMortemHelp,
  pdca: pdcaHelp,
  "five_whys": fiveWhysHelp,
  "veil_of_ignorance": veilOfIgnoranceHelp,
  markkula: markkulaHelp,
  sdm: sdmHelp,
  grade: gradeHelp,
  irac: iracHelp,
  "learned_hand": learnedHandHelp,
  ooda: oodaHelp,
  ach: achHelp,
  dcf: dcfHelp,
  kelly: kellyHelp,
  "structured_interview": structuredInterviewHelp,
  scorecard: scorecardHelp,
  odyssey: odysseyHelp,
  "regret_min": regretMinHelp,
  adr: adrHelp,
  pugh: pughHelp,
  "cross_validation": crossValidationHelp,
  "cost_sensitive": costSensitiveHelp,
  qaly: qalyHelp,
  ria: riaHelp,
  lca: lcaHelp,
  doughnut: doughnutHelp,
  rpd: rpdHelp,
  ics: icsHelp,
  "allison_lenses": allisonLensesHelp,
  deterrence: deterrenceHelp,
  "design_thinking": designThinkingHelp,
  lean: leanHelp,
  meddic: meddicHelp,
  stp: stpHelp,
  "harvard_negotiation": harvardNegotiationHelp,
  tki: tkiHelp,
  "budget_503020": budget503020Help,
  "sunk_cost": sunkCostHelp,
  wpa: wpaHelp,
  pythagorean: pythagoreanHelp,
  "algo_impact": algoImpactHelp,
  "model_card": modelCardHelp,
  stoic: stoicHelp,
  ignatian: ignatianHelp,
};
