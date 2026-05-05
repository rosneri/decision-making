import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/monte-carlo";

describe("<MonteCarlo />", () => {
  it("renders a histogram and reports P(ruin)", () => {
    render(<View data={sample} />);
    expect(screen.getByTestId("mc-histogram")).toBeInTheDocument();
    const pruin = screen.getByTestId("mc-pruin");
    // sample mean 1.2M, threshold 800k, std 500k: ruin probability ~20-30%
    const v = parseFloat(pruin.textContent ?? "");
    expect(v).toBeGreaterThan(0);
    expect(v).toBeLessThan(100);
  });
});
