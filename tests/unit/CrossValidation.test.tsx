import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/cross-validation";

describe("<CrossValidation />", () => {
  it("renders mean ± std for each model", () => {
    render(<View data={sample} />);
    for (let i = 0; i < sample.models.length; i++) {
      expect(screen.getByTestId(`cv-stats-${i}`).textContent).toMatch(/0\.\d{2}\s±\s0\.\d{2}/);
    }
  });
});
