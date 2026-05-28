import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/insights", () => ({
  runClarify: vi.fn(),
  runAnalyze: vi.fn(),
  runModify: vi.fn(),
}));

import * as insights from "@/lib/insights";
import { GET, POST } from "@/app/api/v1/insights/route";

const runClarify = insights.runClarify as unknown as ReturnType<typeof vi.fn>;
const runAnalyze = insights.runAnalyze as unknown as ReturnType<typeof vi.fn>;
const runModify = insights.runModify as unknown as ReturnType<typeof vi.fn>;

type Envelope = {
  ok: boolean;
  data?: unknown;
  meta?: { action?: string; framework?: string };
  error?: { code?: string; message?: string; help?: unknown };
};

function post(body: unknown): Request {
  const init: RequestInit = {
    method: "POST",
    headers: { "content-type": "application/json" },
  };
  if (body !== undefined) init.body = JSON.stringify(body);
  return new Request("http://localhost/api/v1/insights", init);
}

async function asJson(res: Response): Promise<{ status: number; body: Envelope }> {
  return { status: res.status, body: (await res.json()) as Envelope };
}

beforeEach(() => {
  runClarify.mockReset();
  runAnalyze.mockReset();
  runModify.mockReset();
});

describe("GET /api/v1/insights", () => {
  it("returns a help object for discovery", async () => {
    const res = await GET();
    const { status, body } = await asJson(res);
    expect(status).toBe(200);
    expect(body.ok).toBe(true);
    const data = body.data as { endpoint: string; actions: Record<string, unknown>; frameworkIds: unknown };
    expect(data.endpoint).toBe("POST /api/v1/insights");
    expect(data.actions).toMatchObject({ clarify: expect.any(Object), analyze: expect.any(Object), modify: expect.any(Object) });
    expect(Array.isArray(data.frameworkIds)).toBe(true);
  });
});

describe("POST /api/v1/insights — input errors", () => {
  it("invalid JSON returns help", async () => {
    const req = new Request("http://localhost/api/v1/insights", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "not-json",
    });
    const { status, body } = await asJson(await POST(req));
    expect(status).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.error?.code).toBe("INVALID_JSON");
    expect(body.error?.help).toBeDefined();
  });

  it("missing action returns help", async () => {
    const { status, body } = await asJson(await POST(post({ decisionText: "x" })));
    expect(status).toBe(400);
    expect(body.error?.code).toBe("MISSING_ACTION");
    expect(body.error?.help).toBeDefined();
  });

  it("unknown action returns help with list of valid actions", async () => {
    const { status, body } = await asJson(await POST(post({ action: "foo" })));
    expect(status).toBe(400);
    expect(body.error?.code).toBe("UNKNOWN_ACTION");
    expect(body.error?.message).toMatch(/clarify/);
    expect(body.error?.help).toBeDefined();
  });
});

describe("POST /api/v1/insights — clarify", () => {
  it("happy path with questions", async () => {
    runClarify.mockResolvedValue({ ok: true, skip: false, questions: [{ id: "q1", text: "?", type: "text" }] });
    const { status, body } = await asJson(await POST(post({ action: "clarify", decisionText: "help" })));
    expect(status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.meta?.action).toBe("clarify");
    expect(body.data).toMatchObject({ skip: false });
  });

  it("happy path with skip", async () => {
    runClarify.mockResolvedValue({ ok: true, skip: true });
    const { body } = await asJson(await POST(post({ action: "clarify", decisionText: "x" })));
    expect(body.data).toEqual({ skip: true });
  });

  it("validation error returns help", async () => {
    runClarify.mockResolvedValue({ ok: false, code: "INVALID_INPUT", status: 400, detail: "missing" });
    const { status, body } = await asJson(await POST(post({ action: "clarify" })));
    expect(status).toBe(400);
    expect(body.error?.code).toBe("INVALID_INPUT");
    expect(body.error?.help).toBeDefined();
  });
});

describe("POST /api/v1/insights — analyze", () => {
  it("happy path forwards framework data and altFrameworks", async () => {
    const data = { framework: "first_principles", category: "x", title: "t", recommendation: "r", altFrameworks: [] };
    runAnalyze.mockResolvedValue({ ok: true, data });
    const { status, body } = await asJson(await POST(post({ action: "analyze", decisionText: "ok" })));
    expect(status).toBe(200);
    expect(body.data).toEqual(data);
    expect(body.meta?.framework).toBe("first_principles");
  });

  it("error from lib is propagated without help", async () => {
    runAnalyze.mockResolvedValue({ ok: false, code: "SCHEMA_FAIL", status: 502, detail: "boom" });
    const { status, body } = await asJson(await POST(post({ action: "analyze", decisionText: "ok" })));
    expect(status).toBe(502);
    expect(body.error?.code).toBe("SCHEMA_FAIL");
    expect(body.error?.help).toBeUndefined();
  });
});

describe("POST /api/v1/insights — modify", () => {
  it("happy path wraps in updatedData", async () => {
    const updated = { framework: "first_principles", category: "x", title: "t", recommendation: "r" };
    runModify.mockResolvedValue({ ok: true, data: updated });
    const { status, body } = await asJson(await POST(post({
      action: "modify",
      decisionText: "ok",
      currentData: { framework: "first_principles" },
      instruction: "tighten the title",
    })));
    expect(status).toBe(200);
    expect(body.data).toEqual({ updatedData: updated });
  });

  it("missing instruction returns help", async () => {
    runModify.mockResolvedValue({ ok: false, code: "INVALID_INPUT", status: 400, detail: "instruction missing" });
    const { status, body } = await asJson(await POST(post({ action: "modify", decisionText: "ok", currentData: {} })));
    expect(status).toBe(400);
    expect(body.error?.help).toBeDefined();
  });
});
