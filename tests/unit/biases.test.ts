import { describe, expect, it } from "vitest";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { BIASES, BIAS_FAMILIES, BIAS_IDS, biasesByFamily, buildBiasCatalogPrompt, getBias, isBiasId, summarizeBiases, type BiasFinding } from "@/biases";
import { FRAMEWORKS } from "@/frameworks";

const FRAMEWORK_IDS = new Set<string>(FRAMEWORKS.map((f) => f.id));

describe("bias catalog", () => {
  it("has a substantial catalog", () => {
    expect(BIASES.length).toBeGreaterThanOrEqual(40);
  });

  it("every catalog file is registered in the index", () => {
    const dir = resolve(__dirname, "../../src/biases/catalog");
    const files = readdirSync(dir).filter((f) => f.endsWith(".ts")).map((f) => f.replace(/\.ts$/, "").replace(/-/g, "_"));
    const missing = files.filter((id) => !isBiasId(id));
    expect(missing, `catalog files not registered in src/biases/index.ts: ${missing.join(", ")}`).toEqual([]);
    expect(files.length).toBe(BIASES.length);
  });

  it("ids are unique snake_case and match their file name", () => {
    const seen = new Set<string>();
    for (const b of BIASES) {
      expect(b.id).toMatch(/^[a-z][a-z0-9_]*$/);
      expect(seen.has(b.id), `duplicate id ${b.id}`).toBe(false);
      seen.add(b.id);
    }
    expect(BIAS_IDS.length).toBe(seen.size);
  });

  it("every entry is complete", () => {
    for (const b of BIASES) {
      expect(b.name.trim().length, b.id).toBeGreaterThan(0);
      expect(Object.keys(BIAS_FAMILIES)).toContain(b.family);
      expect(b.blurb.trim().length, b.id).toBeGreaterThan(20);
      expect(b.description.trim().length, b.id).toBeGreaterThan(80);
      expect(b.cues.length, b.id).toBeGreaterThanOrEqual(2);
      expect(b.question.trim().endsWith("?"), `${b.id} question should be a question`).toBe(true);
      expect(b.counters.length, b.id).toBeGreaterThanOrEqual(2);
      expect(b.antidotes.length, b.id).toBeGreaterThanOrEqual(1);
    }
  });

  it("antidotes reference real frameworks", () => {
    for (const b of BIASES) {
      for (const id of b.antidotes) {
        expect(FRAMEWORK_IDS.has(id), `${b.id} → unknown framework ${id}`).toBe(true);
      }
    }
  });

  it("every family has at least one bias", () => {
    for (const g of biasesByFamily()) {
      expect(g.biases.length, g.family).toBeGreaterThan(0);
    }
  });

  it("lookup helpers work", () => {
    expect(getBias("sunk_cost_fallacy")?.name).toBe("Sunk cost fallacy");
    expect(getBias("nope")).toBeUndefined();
    expect(isBiasId("anchoring")).toBe(true);
    expect(isBiasId("Anchoring")).toBe(false);
  });

  it("catalog prompt lists every id with cues", () => {
    const prompt = buildBiasCatalogPrompt();
    for (const b of BIASES) {
      expect(prompt).toContain(`"${b.id}"`);
      expect(prompt).toContain(b.cues[0]!);
    }
  });
});

function finding(id: string, severity: number, dismissed?: boolean): BiasFinding {
  const f: BiasFinding = { id, name: id, family: "pattern", severity, evidence: "e", effect: "x", counter: "c" };
  return dismissed === undefined ? f : { ...f, dismissed };
}

describe("summarizeBiases", () => {
  it("is low with nothing", () => {
    const s = summarizeBiases(undefined);
    expect(s.risk).toBe("low");
    expect(s.top).toBeNull();
    expect(s.active).toEqual([]);
  });

  it("is high when one finding is strong", () => {
    const s = summarizeBiases([finding("a", 4), finding("b", 1)]);
    expect(s.risk).toBe("high");
    expect(s.top?.id).toBe("a");
  });

  it("is high when medium findings stack", () => {
    expect(summarizeBiases([finding("a", 3), finding("b", 3), finding("c", 2)]).risk).toBe("high");
  });

  it("is medium for a couple of mild ones", () => {
    expect(summarizeBiases([finding("a", 2), finding("b", 2)]).risk).toBe("medium");
  });

  it("ignores dismissed findings", () => {
    const s = summarizeBiases([finding("a", 5, true), finding("b", 2)]);
    expect(s.risk).toBe("medium");
    expect(s.dismissed).toBe(1);
    expect(s.top?.id).toBe("b");
  });
});
