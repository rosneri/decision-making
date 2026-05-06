import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/scamper";

describe("<Scamper />", () => {
  it("renders all seven prompts", () => {
    render(<View data={sample} />);
    for (const p of ["S", "C", "A", "M", "P", "E", "R"]) {
      expect(screen.getByTestId(`scamper-${p}`)).toBeInTheDocument();
    }
  });
});
