import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("ai", () => ({ generateObject: vi.fn() }));

import { generateObject } from "ai";
import type { LanguageModel } from "ai";
import { describeBiasFindings, normalizeBiasFindings, runDetectBiases } from "@/lib/insights/detect-biases";

const gen = generateObject as unknown as ReturnType<typeof vi.fn>;
const model = "fake-model" as unknown as LanguageModel;

beforeEach(() => { gen.mockReset(); });

describe("normalizeBiasFindings", () => {
  it("drops unknown ids, dedupes, clamps, enriches and sorts", () => {
    const out = normalizeBiasFindings({ biases: [
      { id: "anchoring", severity: 2, evidence: " a ", effect: "b", counter: "c" },
      { id: "made_up", severity: 5, evidence: "a", effect: "b", counter: "c" },
      { id: "Sunk_Cost_Fallacy", severity: 5, evidence: "a", effect: "b", counter: "c" },
      { id: "anchoring", severity: 5, evidence: "dup", effect: "b", counter: "c" },
    ] });
    expect(out.map((f) => f.id)).toEqual(["sunk_cost_fallacy", "anchoring"]);
    expect(out[0]).toMatchObject({ name: "Sunk cost fallacy", family: "stability", severity: 5 });
    expect(out[1]?.evidence).toBe("a");
    expect(out[1]?.severity).toBe(2);
  });

  it("caps at four findings", () => {
    const ids = ["anchoring", "groupthink", "optimism_bias", "halo_effect", "framing_effect", "recency_bias"];
    const out = normalizeBiasFindings({ biases: ids.map((id, i) => ({ id, severity: 5 - (i % 5), evidence: "e", effect: "x", counter: "c" })) });
    expect(out.length).toBe(4);
  });

  it("returns empty for malformed input", () => {
    expect(normalizeBiasFindings(null)).toEqual([]);
    expect(normalizeBiasFindings({ biases: [{ id: "anchoring", severity: 9, evidence: "e", effect: "x", counter: "c" }] })).toEqual([]);
  });
});

describe("describeBiasFindings", () => {
  it("is empty with no active findings", () => {
    expect(describeBiasFindings(undefined)).toBe("");
    expect(describeBiasFindings([{ id: "anchoring", name: "Anchoring", family: "stability", severity: 3, evidence: "e", effect: "x", counter: "c", dismissed: true }])).toBe("");
  });

  it("lists active findings with severity and evidence", () => {
    const text = describeBiasFindings([{ id: "anchoring", name: "Anchoring", family: "stability", severity: 3, evidence: "last year's budget", effect: "drags the estimate", counter: "c" }]);
    expect(text).toContain("Anchoring (severity 3/5)");
    expect(text).toContain("last year's budget");
  });
});

describe("runDetectBiases", () => {
  it("returns normalized findings from the model", async () => {
    gen.mockResolvedValue({ object: { biases: [{ id: "optimism_bias", severity: 4, evidence: "it'll be fine", effect: "x", counter: "c" }] } });
    const out = await runDetectBiases({ decisionText: "It'll be fine", model });
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({ id: "optimism_bias", name: "Optimism bias", family: "action" });
    const call = gen.mock.calls[0]?.[0] as { system: string; prompt: string };
    expect(call.system).toContain('"optimism_bias"');
    expect(call.prompt).toContain("It'll be fine");
  });

  it("degrades to no findings when the model call fails", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    gen.mockRejectedValue(new Error("boom"));
    expect(await runDetectBiases({ decisionText: "x", model })).toEqual([]);
    warn.mockRestore();
  });
});
