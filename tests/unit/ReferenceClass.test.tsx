import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/reference-class";

describe("<ReferenceClass />", () => {
  it("computes adjusted estimate based on past base rate", () => {
    render(<View data={sample} />);
    // Sum estimate=61, sum actual=108, ratio≈1.77, your=12 → 21.2
    const adjusted = screen.getByTestId("refclass-adjusted");
    expect(adjusted.textContent).toMatch(/21\.\d/);
  });

  it("changing your estimate updates adjusted output", () => {
    render(<View data={sample} />);
    fireEvent.change(screen.getByTestId("refclass-your-estimate"), { target: { value: "6" } });
    const adjusted = screen.getByTestId("refclass-adjusted");
    // 6 * (108/61) ≈ 10.6
    expect(adjusted.textContent).toMatch(/10\.\d/);
  });
});
