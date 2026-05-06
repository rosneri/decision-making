import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/aida";

describe("<Aida />", () => {
  it("renders all four stages", () => {
    render(<View data={sample} />);
    for (const k of ["A", "I", "D", "Action"]) {
      expect(screen.getByTestId(`aida-${k}`)).toBeInTheDocument();
    }
  });
});
