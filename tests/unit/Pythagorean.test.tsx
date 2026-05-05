import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/pythagorean";

describe("<Pythagorean />", () => {
  it("computes expected wins from PF/PA", () => {
    render(<View data={sample} />);
    // PF=412, PA=356, exp ≈ 412² / (412² + 356²) ≈ 0.5727 → 9.16 wins of 16
    const expected = screen.getByTestId("pyth-expected").textContent ?? "";
    expect(expected).toMatch(/9\.\d/);
  });

  it("luck is positive when actual > expected", () => {
    render(<View data={sample} />);
    expect(screen.getByTestId("pyth-luck").textContent).toMatch(/luck = \+/);
  });

  it("equal PF and PA yields .500 expectation", () => {
    render(<View data={{ ...sample, pointsFor: 100, pointsAgainst: 100 }} />);
    expect(screen.getByTestId("pyth-expected").textContent).toMatch(/\.500/);
  });

  it("editing PF updates the expectation", () => {
    render(<View data={sample} />);
    fireEvent.change(screen.getByTestId("pyth-pointsFor"), { target: { value: "1000" } });
    const expected = screen.getByTestId("pyth-expected").textContent ?? "";
    expect(expected).toMatch(/1[45]\.\d/); // dramatic increase
  });
});
