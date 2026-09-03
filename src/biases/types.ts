// Shared types for the cognitive-bias catalog. Lives in its own module so
// each catalog entry can import the type without depending on the registry
// (mirrors src/frameworks/help-types.ts).

import type { FrameworkId } from "@/frameworks";

// Families follow Lovallo & Sibony's taxonomy of strategic-decision biases
// ("The case for behavioral strategy", McKinsey Quarterly 2010; Kahneman,
// Lovallo & Sibony, HBR 2011) plus a sixth family for framing and estimation
// effects that sit outside their five.
export const BIAS_FAMILIES = {
  action:    { name: "Action-oriented",  blurb: "Overestimating what doing something will achieve." },
  interest:  { name: "Interest",         blurb: "Incentives and attachments that quietly steer the call." },
  pattern:   { name: "Pattern-recognition", blurb: "Seeing shapes in the evidence that aren't there." },
  stability: { name: "Stability",        blurb: "Clinging to where you already are." },
  social:    { name: "Social",           blurb: "The pull of the group and of authority." },
  framing:   { name: "Framing & estimation", blurb: "How the question is posed and how numbers are felt." },
} as const;

export type BiasFamily = keyof typeof BIAS_FAMILIES;

export interface BiasDefinition {
  // Stable snake_case identifier. Used by the model, the API and the UI.
  id: string;
  // Display name.
  name: string;
  family: BiasFamily;
  // One sentence. Used in lists and in the detection prompt.
  blurb: string;
  // Two or three plain-English sentences on what the bias is and how it
  // shows up in real decisions.
  description: string;
  // Signals in a written-up decision that suggest the bias is in play. The
  // detection prompt leans on these, so keep them concrete and observable.
  cues: string[];
  // A self-check question the user can ask themselves.
  question: string;
  // Concrete de-biasing moves, each one actionable in an afternoon.
  counters: string[];
  // Frameworks in the library that structurally counter this bias. The UI
  // offers these as one-click "try instead" switches.
  antidotes: FrameworkId[];
  // Alternative names people may know it by.
  aka?: string[];
  // Canonical reference (author, year) for the curious.
  source?: string;
}

// Identity helper that preserves the literal `id` so the registry can derive
// a `BiasId` union from the catalog. Adding a bias = one file + one import.
export function defineBias<const T extends BiasDefinition>(def: T): T {
  return def;
}
