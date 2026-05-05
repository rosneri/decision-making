import type { FrameworkHelp } from "../help-types";

export const help: FrameworkHelp = {
    expandedName: "ICS — Incident Command System",
    whatItIs:
      "Standard incident-response structure: one Incident Commander, four sections (Operations, Planning, Logistics, Finance), and a span of control of about 1:5.",
    howToUse: [
      "Name a single Incident Commander immediately. They own the response.",
      "Spin up the four sections only as the incident grows — don't over-build for a small incident.",
      "Keep span of control roughly 1:5 (one supervisor per 3–7 reports).",
      "Use plain language and standardized titles, not org-specific jargon.",
    ],
    glossary: {
      "Incident Commander": "The single person accountable for the entire response.",
      "Span of control": "How many people one supervisor directly oversees (target ~5).",
    },
  };
