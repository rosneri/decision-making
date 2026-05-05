import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { View as DecisionMatrixView } from "@/frameworks/decision-matrix";
import type { DecisionMatrix } from "@/frameworks";

const sample: DecisionMatrix = {
  framework: "decision_matrix",
  category: "Analysis & evaluation",
  title: "Pick a city",
  criteria: [
    { name: "Cost", weight: 5 },
    { name: "Weather", weight: 5 },
  ],
  options: [
    { name: "Lisbon", scores: [8, 9] },
    { name: "Berlin", scores: [6, 5] },
  ],
  recommendation: "Lisbon wins",
};

describe("<DecisionMatrixView />", () => {
  it("renders option rows", () => {
    render(<DecisionMatrixView data={sample} />);
    expect(screen.getByDisplayValue("Lisbon")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Berlin")).toBeInTheDocument();
  });

  it("computes weighted totals and marks the winner", () => {
    render(<DecisionMatrixView data={sample} />);
    // totalW=10; Lisbon: (8*5+9*5)/10=8.50; Berlin: (6*5+5*5)/10=5.50
    const rows = screen.getAllByRole("row");
    expect(within(rows[1]!).getByText("8.50")).toBeInTheDocument();
    expect(within(rows[2]!).getByText("5.50")).toBeInTheDocument();
    // winner row is marked with ▸
    expect(within(rows[1]!).getByText("▸")).toBeInTheDocument();
  });

  it("recomputes totals when a score changes", () => {
    render(<DecisionMatrixView data={sample} />);
    // Sliders are weight inputs; spinbuttons are score inputs
    // spinbutton order: opt0-c0, opt0-c1, opt1-c0, opt1-c1
    // Boost Berlin's first score from 6 → 10: (10*5+5*5)/10 = 7.50
    const spinbuttons = screen.getAllByRole("spinbutton");
    fireEvent.change(spinbuttons[2]!, { target: { value: "10" } });
    const rows = screen.getAllByRole("row");
    expect(within(rows[2]!).getByText("7.50")).toBeInTheDocument();
  });
});
