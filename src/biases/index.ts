// Registry for the cognitive-bias catalog. Mirrors src/frameworks/index.ts:
// each bias lives in its own file under ./catalog and is registered here.
//
// To add a bias:
//   1. create src/biases/catalog/<id>.ts exporting `bias = defineBias({...})`
//   2. import it below and add it to ALL
// tests/unit/biases.test.ts fails if a catalog file is not registered.

import type { BiasDefinition, BiasFamily } from "./types";
import { BIAS_FAMILIES } from "./types";

// Action-oriented
import { bias as optimismBias } from "./catalog/optimism-bias";
import { bias as overconfidence } from "./catalog/overconfidence";
import { bias as planningFallacy } from "./catalog/planning-fallacy";
import { bias as illusionOfControl } from "./catalog/illusion-of-control";
import { bias as competitorNeglect } from "./catalog/competitor-neglect";
import { bias as actionBias } from "./catalog/action-bias";
// Interest
import { bias as selfServingBias } from "./catalog/self-serving-bias";
import { bias as inappropriateAttachment } from "./catalog/inappropriate-attachment";
import { bias as presentBias } from "./catalog/present-bias";
import { bias as affectHeuristic } from "./catalog/affect-heuristic";
// Pattern-recognition
import { bias as confirmationBias } from "./catalog/confirmation-bias";
import { bias as availabilityHeuristic } from "./catalog/availability-heuristic";
import { bias as baseRateNeglect } from "./catalog/base-rate-neglect";
import { bias as recencyBias } from "./catalog/recency-bias";
import { bias as haloEffect } from "./catalog/halo-effect";
import { bias as narrativeFallacy } from "./catalog/narrative-fallacy";
import { bias as survivorshipBias } from "./catalog/survivorship-bias";
import { bias as hindsightBias } from "./catalog/hindsight-bias";
import { bias as smallNumbers } from "./catalog/small-numbers";
import { bias as outcomeBias } from "./catalog/outcome-bias";
import { bias as curseOfKnowledge } from "./catalog/curse-of-knowledge";
import { bias as noveltyBias } from "./catalog/novelty-bias";
// Stability
import { bias as anchoring } from "./catalog/anchoring";
import { bias as statusQuoBias } from "./catalog/status-quo-bias";
import { bias as lossAversion } from "./catalog/loss-aversion";
import { bias as sunkCostFallacy } from "./catalog/sunk-cost-fallacy";
import { bias as escalationOfCommitment } from "./catalog/escalation-of-commitment";
import { bias as endowmentEffect } from "./catalog/endowment-effect";
import { bias as ambiguityAversion } from "./catalog/ambiguity-aversion";
import { bias as omissionBias } from "./catalog/omission-bias";
import { bias as normalcyBias } from "./catalog/normalcy-bias";
import { bias as regretAversion } from "./catalog/regret-aversion";
// Social
import { bias as groupthink } from "./catalog/groupthink";
import { bias as authorityBias } from "./catalog/authority-bias";
import { bias as bandwagonEffect } from "./catalog/bandwagon-effect";
import { bias as falseConsensus } from "./catalog/false-consensus";
import { bias as fundamentalAttributionError } from "./catalog/fundamental-attribution-error";
import { bias as ingroupBias } from "./catalog/ingroup-bias";
import { bias as stereotyping } from "./catalog/stereotyping";
// Framing & estimation
import { bias as framingEffect } from "./catalog/framing-effect";
import { bias as scopeInsensitivity } from "./catalog/scope-insensitivity";
import { bias as zeroRiskBias } from "./catalog/zero-risk-bias";
import { bias as neglectOfProbability } from "./catalog/neglect-of-probability";
import { bias as mentalAccounting } from "./catalog/mental-accounting";
import { bias as decoyEffect } from "./catalog/decoy-effect";
import { bias as distinctionBias } from "./catalog/distinction-bias";
import { bias as focusingIllusion } from "./catalog/focusing-illusion";
import { bias as projectionBias } from "./catalog/projection-bias";
import { bias as informationBias } from "./catalog/information-bias";
import { bias as trivialityBias } from "./catalog/triviality-bias";
import { bias as choiceOverload } from "./catalog/choice-overload";

export type { BiasDefinition, BiasFamily } from "./types";
export { BIAS_FAMILIES, defineBias } from "./types";
export { BiasFindingSchema, BiasFindingsSchema, BiasDetectionSchema } from "./schema";
export type { BiasFinding, BiasDetection } from "./schema";
export { summarizeBiases } from "./summary";
export type { BiasSummary, BiasRisk } from "./summary";

const ALL = [
  optimismBias, overconfidence, planningFallacy, illusionOfControl, competitorNeglect, actionBias,
  selfServingBias, inappropriateAttachment, presentBias, affectHeuristic,
  confirmationBias, availabilityHeuristic, baseRateNeglect, recencyBias, haloEffect, narrativeFallacy,
  survivorshipBias, hindsightBias, smallNumbers, outcomeBias, curseOfKnowledge, noveltyBias,
  anchoring, statusQuoBias, lossAversion, sunkCostFallacy, escalationOfCommitment, endowmentEffect,
  ambiguityAversion, omissionBias, normalcyBias, regretAversion,
  groupthink, authorityBias, bandwagonEffect, falseConsensus, fundamentalAttributionError, ingroupBias, stereotyping,
  framingEffect, scopeInsensitivity, zeroRiskBias, neglectOfProbability, mentalAccounting, decoyEffect,
  distinctionBias, focusingIllusion, projectionBias, informationBias, trivialityBias, choiceOverload,
] as const;

export type BiasId = typeof ALL[number]["id"];

export const BIASES: readonly BiasDefinition[] = ALL;
export const BIAS_IDS = ALL.map((b) => b.id) as BiasId[];

const BY_ID = new Map<string, BiasDefinition>(ALL.map((b) => [b.id, b]));

export function getBias(id: string): BiasDefinition | undefined {
  return BY_ID.get(id);
}

export function isBiasId(id: string): id is BiasId {
  return BY_ID.has(id);
}

export const FAMILY_ORDER = Object.keys(BIAS_FAMILIES) as BiasFamily[];

// Biases grouped by family, in taxonomy order. Used by the library page and
// the detection prompt.
export function biasesByFamily(): Array<{ family: BiasFamily; name: string; blurb: string; biases: BiasDefinition[] }> {
  return FAMILY_ORDER.map((family) => ({
    family,
    name: BIAS_FAMILIES[family].name,
    blurb: BIAS_FAMILIES[family].blurb,
    biases: ALL.filter((b) => b.family === family),
  }));
}

// Compact catalog listing for the detection prompt: one line per bias with
// its cues, grouped by family. Roughly 2k tokens for the full catalog.
export function buildBiasCatalogPrompt(): string {
  const lines: string[] = [];
  for (const group of biasesByFamily()) {
    lines.push(`\n${group.name} — ${group.blurb}`);
    for (const b of group.biases) {
      lines.push(`  - "${b.id}" — ${b.name}: ${b.blurb} Cues: ${b.cues.join("; ")}`);
    }
  }
  return lines.join("\n");
}
