import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/pestel";

describe("<Pestel />", () => {
  it("renders all six factor sections", () => {
    render(<View data={sample} />);
    for (const k of ["Political", "Economic", "Social", "Technological", "Environmental", "Legal"]) {
      expect(screen.getByTestId(`pestel-${k}`)).toBeInTheDocument();
    }
  });
});
