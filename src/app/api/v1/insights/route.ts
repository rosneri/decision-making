import { NextResponse } from "next/server";
import { runAnalyze, runClarify, runModify } from "@/lib/insights";
import { FRAMEWORKS } from "@/frameworks";
import { BIAS_IDS } from "@/biases";

export const maxDuration = 60;

const VALID_ACTIONS = ["clarify", "analyze", "modify"] as const;
type Action = typeof VALID_ACTIONS[number];

// Self-describing help object returned on malformed input. Lets clients
// discover the API by hitting the endpoint with no body.
function helpObject() {
  return {
    endpoint: "POST /api/v1/insights",
    description: "Decision-analysis API. Stateless — the client holds currentData between turns.",
    envelope: {
      success: { ok: true, data: "<action-specific payload>", meta: { action: "<action>" } },
      error: { ok: false, error: { code: "STRING_CODE", message: "human readable", help: "(optional) help object for input errors" } },
    },
    actions: {
      clarify: {
        body: { action: "clarify", decisionText: "string (required)" },
        returns: "{ skip: true } | { skip: false, questions: [{id,text,type,options?,multiSelect?}] }",
        purpose: "Optional first step. Ask the model whether the decision needs follow-up questions before analysis.",
      },
      analyze: {
        body: { action: "analyze", decisionText: "string (required)", frameworkId: "string (optional — skips selection)" },
        returns: "framework analysis object including { framework, category, title, recommendation, ...framework-specific fields, altFrameworks, biasFindings }",
        purpose: "Main inference. Picks a framework, runs a cognitive-bias check on the write-up, and generates structured analysis that takes the flagged biases into account.",
        biasFindings: "array of { id, name, family, severity (1-5), evidence, effect, counter, dismissed? } — see biasIds. Empty when nothing is suggested by the text.",
      },
      modify: {
        body: { action: "modify", decisionText: "string (required)", currentData: "object (required, from prior analyze response)", instruction: "string (required, natural-language adjustment)" },
        returns: "{ updatedData: <same shape as analyze data> }",
        purpose: "Back-and-forth. Apply a targeted adjustment to a prior analysis. Repeatable.",
      },
    },
    flow: [
      "1. POST {action:'clarify', decisionText}            (optional)",
      "2. POST {action:'analyze', decisionText}            -> analysis",
      "3. POST {action:'modify', decisionText, currentData, instruction}  (repeat as needed)",
    ],
    frameworkIds: FRAMEWORKS.map((f) => f.id),
    biasIds: BIAS_IDS,
  };
}

function errorResponse(code: string, message: string, status: number, extra?: { help?: unknown }) {
  return NextResponse.json(
    { ok: false, error: { code, message, ...(extra?.help !== undefined ? { help: extra.help } : {}) } },
    { status },
  );
}

function success(action: Action, data: unknown, extraMeta?: Record<string, unknown>) {
  return NextResponse.json({ ok: true, data, meta: { action, ...extraMeta } });
}

export async function GET() {
  // Discovery: GET returns the help object so callers can introspect the API.
  return NextResponse.json({ ok: true, data: helpObject(), meta: { action: "help" } });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse("INVALID_JSON", "Request body is not valid JSON.", 400, { help: helpObject() });
  }

  if (!body || typeof body !== "object") {
    return errorResponse("INVALID_INPUT", "Request body must be a JSON object.", 400, { help: helpObject() });
  }

  const action = (body as { action?: unknown }).action;
  if (typeof action !== "string") {
    return errorResponse("MISSING_ACTION", `Missing "action". Expected one of: ${VALID_ACTIONS.join(", ")}.`, 400, { help: helpObject() });
  }
  if (!(VALID_ACTIONS as readonly string[]).includes(action)) {
    return errorResponse("UNKNOWN_ACTION", `Unknown action "${action}". Expected one of: ${VALID_ACTIONS.join(", ")}.`, 400, { help: helpObject() });
  }

  const params = body as Record<string, unknown>;

  if (action === "clarify") {
    const result = await runClarify({ decisionText: params["decisionText"] });
    if (!result.ok) {
      return errorResponse(result.code, result.detail, result.status, result.code === "INVALID_INPUT" ? { help: helpObject() } : undefined);
    }
    return success("clarify", result.skip
      ? { skip: true }
      : { skip: false, questions: result.questions });
  }

  if (action === "analyze") {
    const result = await runAnalyze({ decisionText: params["decisionText"], frameworkId: params["frameworkId"] });
    if (!result.ok) {
      return errorResponse(result.code, result.detail, result.status, result.code === "INVALID_INPUT" ? { help: helpObject() } : undefined);
    }
    return success("analyze", result.data, { framework: (result.data as { framework?: string }).framework });
  }

  // action === "modify"
  const result = await runModify({
    decisionText: params["decisionText"],
    currentData: params["currentData"],
    instruction: params["instruction"],
  });
  if (!result.ok) {
    return errorResponse(result.code, result.detail, result.status, result.code === "INVALID_INPUT" ? { help: helpObject() } : undefined);
  }
  return success("modify", { updatedData: result.data });
}
