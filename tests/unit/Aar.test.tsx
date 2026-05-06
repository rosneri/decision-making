import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/aar";

describe("<Aar />", () => {
  it("renders all four sections", () => {
    render(<View data={sample} />);
    for (const k of ["intended", "actual", "why", "next"]) {
      expect(screen.getByTestId(`aar-${k}`)).toBeInTheDocument();
    }
  });

  it("renders why and next list items", () => {
    render(<View data={sample} />);
    expect(screen.getByTestId("aar-why-item-0")).toBeInTheDocument();
    expect(screen.getByTestId("aar-next-item-0")).toBeInTheDocument();
  });
});
