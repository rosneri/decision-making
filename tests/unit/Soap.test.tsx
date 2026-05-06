import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/soap";

describe("<Soap />", () => {
  it("renders all four sections", () => {
    render(<View data={sample} />);
    for (const k of ["S", "O", "A", "P"]) {
      expect(screen.getByTestId(`soap-${k}`)).toBeInTheDocument();
    }
  });
});
