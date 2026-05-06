import type { FrameworkHelp } from "../help-types";

export const help: FrameworkHelp = {
  expandedName: "SOAP Notes (Subjective, Objective, Assessment, Plan)",
  whatItIs:
    "The standard structure for a clinical encounter note since the 1960s, originally Lawrence Weed's problem-oriented record. Forces the clinician to separate what the patient says from what's measured, draw a conclusion, and commit to next steps.",
  howToUse: [
    "Subjective: chief complaint and history in the patient's own words.",
    "Objective: vital signs, exam, labs, imaging — measurable only.",
    "Assessment: your diagnosis or differential based on S + O.",
    "Plan: numbered list of orders, treatments, and follow-up — every item must be actionable.",
  ],
};
