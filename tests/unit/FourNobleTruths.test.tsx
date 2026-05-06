import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/four-noble-truths";

describe("<FourNobleTruths />", () => {
  it("renders all four truths", () => {
    render(<View data={sample} />);
    for (const k of ["dukkha", "samudaya", "nirodha", "magga"]) {
      expect(screen.getByTestId(`fnt-${k}`)).toBeInTheDocument();
    }
  });
});
