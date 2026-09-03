import { generateObject, type LanguageModel } from "ai";
import { BiasDetectionSchema, buildBiasCatalogPrompt, getBias, type BiasFinding } from "@/biases";

const MAX_FINDINGS = 4;

const SYSTEM = `You are a careful, kind reviewer trained in behavioural decision science. Read the user's written-up decision and identify the cognitive biases most likely to be distorting it, using ONLY ids from the catalog below.

Rules:
- Return between 0 and ${MAX_FINDINGS} findings. Fewer, stronger findings beat many weak ones. Return an empty list if nothing is genuinely suggested by the text.
- Only flag a bias when the user's own words give evidence for it. Do not flag a bias merely because it is common for this type of decision.
- "evidence": quote or closely paraphrase the words that suggest it (under 25 words).
- "effect": one sentence on how this bias could tilt THIS decision, concretely.
- "counter": one concrete move the user can make this week to check or offset it, specific to their situation.
- "severity": 1 = faint hint, 3 = plausibly shaping the call, 5 = very likely steering it.
- Order findings from strongest to weakest. Never repeat an id.
- Plain, warm, second-person English. No jargon beyond the bias name. No moralising.

Catalog:
${buildBiasCatalogPrompt()}`;

// Turns raw model output into validated findings: unknown ids dropped,
// duplicates removed, severity clamped, name/family joined from the catalog,
// sorted strongest-first and capped. Pure; unit-tested.
export function normalizeBiasFindings(raw: unknown): BiasFinding[] {
  const parsed = BiasDetectionSchema.safeParse(raw);
  if (!parsed.success) return [];
  const seen = new Set<string>();
  const out: BiasFinding[] = [];
  for (const f of parsed.data.biases) {
    const id = f.id.trim().toLowerCase();
    const def = getBias(id);
    if (!def || seen.has(id)) continue;
    seen.add(id);
    out.push({
      id,
      name: def.name,
      family: def.family,
      severity: Math.max(1, Math.min(5, Math.round(f.severity))),
      evidence: f.evidence.trim(),
      effect: f.effect.trim(),
      counter: f.counter.trim(),
    });
  }
  out.sort((a, b) => b.severity - a.severity);
  return out.slice(0, MAX_FINDINGS);
}

// Renders findings as a short block for downstream prompts (the framework
// generator and the re-recommend note) so the recommendation can take them
// into account. Dismissed findings are omitted.
export function describeBiasFindings(findings: readonly BiasFinding[] | undefined): string {
  const active = (findings ?? []).filter((f) => !f.dismissed);
  if (active.length === 0) return "";
  const lines = active.map((f) =>
    `- ${f.name} (severity ${f.severity}/5): ${f.effect} Evidence: "${f.evidence}"`,
  );
  return `Bias check on the user's write-up (already run; the user will see these separately):\n${lines.join("\n")}`;
}

// Never throws. A failed detection degrades to "no findings" so the main
// analysis still succeeds.
export async function runDetectBiases(input: { decisionText: string; model: LanguageModel }): Promise<BiasFinding[]> {
  try {
    const { object } = await generateObject({
      model: input.model,
      schema: BiasDetectionSchema,
      system: SYSTEM,
      prompt: `Decision the user wrote:\n\n"${input.decisionText}"\n\nIdentify up to ${MAX_FINDINGS} biases suggested by the text. Use only catalog ids.`,
      maxOutputTokens: 1500,
    });
    return normalizeBiasFindings(object);
  } catch (err) {
    console.warn("[insights/detect-biases] failed, continuing without biases:", err instanceof Error ? err.message : err);
    return [];
  }
}
