import { describe, expect, it } from "vitest";
import {
  DecisionMatrixSchema,
  EisenhowerSchema,
  FRAMEWORKS,
  FrameworkSchema,
  SwotSchema,
} from "@/lib/schemas";

describe("DecisionMatrixSchema", () => {
  it("accepts a valid matrix", () => {
    const ok = DecisionMatrixSchema.safeParse({
      framework: "decision_matrix",
      category: "Analysis & evaluation",
      title: "Pick a job",
      criteria: [
        { name: "Salary", weight: 8 },
        { name: "Growth", weight: 6 },
      ],
      options: [
        { name: "A", scores: [8, 6] },
        { name: "B", scores: [7, 9] },
      ],
      recommendation: "Choose B",
    });
    expect(ok.success).toBe(true);
  });

  it("rejects weights out of range", () => {
    const bad = DecisionMatrixSchema.safeParse({
      framework: "decision_matrix",
      title: "x",
      criteria: [
        { name: "a", weight: 0 },
        { name: "b", weight: 5 },
      ],
      options: [
        { name: "A", scores: [1, 1] },
        { name: "B", scores: [2, 2] },
      ],
      recommendation: "x",
    });
    expect(bad.success).toBe(false);
  });

  it("rejects fewer than 2 options", () => {
    const bad = DecisionMatrixSchema.safeParse({
      framework: "decision_matrix",
      title: "x",
      criteria: [
        { name: "a", weight: 5 },
        { name: "b", weight: 5 },
      ],
      options: [{ name: "Only", scores: [1, 1] }],
      recommendation: "x",
    });
    expect(bad.success).toBe(false);
  });
});

describe("EisenhowerSchema", () => {
  it("requires at least 3 tasks", () => {
    const bad = EisenhowerSchema.safeParse({
      framework: "eisenhower",
      title: "Today",
      tasks: [
        { text: "a", urgent: true, important: true },
        { text: "b", urgent: false, important: true },
      ],
      recommendation: "x",
    });
    expect(bad.success).toBe(false);
  });
});

describe("SwotSchema", () => {
  it("requires every quadrant non-empty", () => {
    const bad = SwotSchema.safeParse({
      framework: "swot",
      title: "x",
      strengths: [],
      weaknesses: ["w"],
      opportunities: ["o"],
      threats: ["t"],
      recommendation: "r",
    });
    expect(bad.success).toBe(false);
  });
});

describe("FrameworkSchema (discriminated union)", () => {
  it("dispatches by framework field", () => {
    const parsed = FrameworkSchema.safeParse({
      framework: "swot",
      category: "Strategy & business",
      title: "x",
      strengths: ["s"],
      weaknesses: ["w"],
      opportunities: ["o"],
      threats: ["t"],
      recommendation: "r",
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects unknown framework", () => {
    const parsed = FrameworkSchema.safeParse({ framework: "bogus" });
    expect(parsed.success).toBe(false);
  });
});

describe("FRAMEWORKS", () => {
  it("exposes the three frameworks with stable ids", () => {
    expect(FRAMEWORKS.map((f) => f.id).sort()).toEqual([
      "decision_matrix",
      "eisenhower",
      "swot",
    ]);
  });
});
