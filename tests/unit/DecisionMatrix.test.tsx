import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { DecisionMatrixView } from "@/components/DecisionMatrix";
import type { DecisionMatrix } from "@/lib/schemas";

const sample: DecisionMatrix = {
  framework: "decision_matrix",
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
  it("renders title and option rows", () => {
    render(<DecisionMatrixView data={sample} />);
    expect(screen.getByText("Pick a city")).toBeInTheDocument();
    expect(screen.getByText("Lisbon")).toBeInTheDocument();
    expect(screen.getByText("Berlin")).toBeInTheDocument();
  });

  it("computes weighted totals and marks the winner", () => {
    render(<DecisionMatrixView data={sample} />);
    // Lisbon: 8*5 + 9*5 = 85; Berlin: 6*5 + 5*5 = 55
    const rows = screen.getAllByRole("row");
    expect(within(rows[1]!).getByText("85")).toBeInTheDocument();
    expect(within(rows[2]!).getByText("55")).toBeInTheDocument();
    expect(screen.getByText(/winner/i)).toBeInTheDocument();
  });

  it("recomputes totals when a score slider changes", () => {
    render(<DecisionMatrixView data={sample} />);
    const sliders = screen.getAllByRole("slider");
    // Layout: [w0, w1, opt0-c0, opt0-c1, opt1-c0, opt1-c1]
    // Boost Berlin's first score from 6 → 10: total 10*5 + 5*5 = 75
    fireEvent.change(sliders[4]!, { target: { value: "10" } });
    const rows = screen.getAllByRole("row");
    expect(within(rows[2]!).getByText("75")).toBeInTheDocument();
  });
});
