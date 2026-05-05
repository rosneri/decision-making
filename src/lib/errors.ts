// Stable error codes shared between server and client.
// Client surfaces the friendly message + the code (small, monospace) so the
// user isn't confused by raw error text but a developer can grep logs for
// the same code.

export const ANALYZE_ERRORS = {
  INVALID_INPUT: {
    code: "DM-ANALYZE-001",
    message: "We didn't catch your decision. Try rewording it.",
  },
  SELECTOR_FAILED: {
    code: "DM-ANALYZE-002",
    message: "We couldn't pick a framework for that. Try rephrasing.",
  },
  UNKNOWN_FRAMEWORK: {
    code: "DM-ANALYZE-003",
    message: "Something went wrong picking a framework. Try again.",
  },
  SCHEMA_FAIL: {
    code: "DM-ANALYZE-004",
    message: "We couldn't fill in the framework. Try again.",
  },
  TRUNCATED: {
    code: "DM-ANALYZE-005",
    message: "The response was cut short. Try a shorter prompt.",
  },
  UPSTREAM: {
    code: "DM-ANALYZE-006",
    message: "The model service is unavailable. Try again in a moment.",
  },
  NO_API_KEY: {
    code: "DM-ANALYZE-007",
    message: "Server is missing its model API key. Contact the operator.",
  },
  AUTH: {
    code: "DM-ANALYZE-008",
    message: "The model service rejected the request. Contact the operator.",
  },
  RATE_LIMIT: {
    code: "DM-ANALYZE-009",
    message: "Too many requests. Wait a moment and try again.",
  },
  UNKNOWN: {
    code: "DM-ANALYZE-999",
    message: "Something went wrong. Try again.",
  },
} as const;

export type AnalyzeErrorKey = keyof typeof ANALYZE_ERRORS;
export type AnalyzeError = typeof ANALYZE_ERRORS[AnalyzeErrorKey];

export interface ApiErrorBody {
  error: {
    code: string;          // e.g. "DM-ANALYZE-004"
    message: string;       // user-friendly
    detail?: string;       // technical detail for logs (optional, for ops)
  };
}

export function buildError(key: AnalyzeErrorKey, detail?: string): ApiErrorBody {
  const e = ANALYZE_ERRORS[key];
  return { error: { code: e.code, message: e.message, ...(detail ? { detail } : {}) } };
}
