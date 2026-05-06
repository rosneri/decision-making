import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/nash";
import { findNash } from "@/frameworks/nash/data";

describe("<Nash />", () => {
  it("flags (Defect, Defect) as the equilibrium", () => {
    render(<View data={sample} />);
    expect(screen.getByTestId("nash-eq-1-1")).toBeInTheDocument();
  });

  it("findNash returns single equilibrium for prisoner's dilemma", () => {
    const eqs = findNash(sample);
    expect(eqs).toHaveLength(1);
    expect(eqs[0]).toEqual([1, 1]);
  });
});
