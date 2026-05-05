import { describe, expect, it } from "vitest";
import { sample, getMetrics } from "@/frameworks/regret-min/data";

describe("<RegretMin />", () => {
  it("identifies the option with greatest regret-asymmetry", () => {
    // Moonshot: 8-2 = 6; Safe: 3-6 = -3 → Moonshot wins
    const pick = getMetrics(sample).find((m) => m.k === "Pick");
    expect(pick?.v).toBe("Moonshot");
  });
});
