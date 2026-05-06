import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/pmesii-pt";

describe("<PmesiiPt />", () => {
  it("renders all eight variables", () => {
    render(<View data={sample} />);
    for (const k of ["Political", "Military", "Economic", "Social", "Information", "Infrastructure", "Physical", "Time"]) {
      expect(screen.getByTestId(`pmesii-${k}`)).toBeInTheDocument();
    }
  });
});
