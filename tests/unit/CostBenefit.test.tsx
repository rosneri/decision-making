import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { View as CostBenefitView } from "@/frameworks/cost-benefit";
import type { CostBenefit } from "@/frameworks";

const sample: CostBenefit = {
  framework: "cost_benefit",
  category: "Analysis & evaluation",
  title: "Buy a car?",
  benefits: [
    { text: "Convenience", weight: 5 },
    { text: "Time saved", weight: 3 },
  ],
  costs: [{ text: "Money", weight: 9 }],
  recommendation: "Cost side carries.",
};

describe("<CostBenefitView />", () => {
  it("renders all benefits and costs", () => {
    render(<CostBenefitView data={sample} />);
    expect(screen.getByText("Convenience")).toBeInTheDocument();
    expect(screen.getByText("Time saved")).toBeInTheDocument();
    expect(screen.getByText("Money")).toBeInTheDocument();
  });

  it("shows the correct totals and verdict in the SVG labels", () => {
    render(<CostBenefitView data={sample} />);
    // Totals: benefits = 8, costs = 9, diff = -1 → cost side carries (|diff|≥1)
    expect(screen.getByText("8 ⟷ 9")).toBeInTheDocument();
    expect(screen.getByText("The cost side carries.")).toBeInTheDocument();
  });

  it("changing a weight updates totals", () => {
    const onUpdate = vi.fn();
    render(<CostBenefitView data={sample} onUpdate={onUpdate} />);
    // First spinbutton is the first benefit's weight (5). Bump to 9.
    const spins = screen.getAllByRole("spinbutton");
    fireEvent.change(spins[0]!, { target: { value: "9" } });
    // benefits = 9+3 = 12, costs = 9 → "12 ⟷ 9", benefit side carries
    expect(screen.getByText("12 ⟷ 9")).toBeInTheDocument();
    expect(screen.getByText("The benefit side carries.")).toBeInTheDocument();
    const last = onUpdate.mock.calls.at(-1)?.[0] as CostBenefit;
    expect(last.benefits[0]?.weight).toBe(9);
  });

  it("adds a new benefit via the input + Add button", () => {
    const onUpdate = vi.fn();
    render(<CostBenefitView data={sample} onUpdate={onUpdate} />);
    const benefitInput = screen.getByPlaceholderText("Add a benefit…");
    fireEvent.change(benefitInput, { target: { value: "Status symbol" } });
    const addButtons = screen.getAllByRole("button", { name: "Add" });
    fireEvent.click(addButtons[0]!);
    expect(screen.getByText("Status symbol")).toBeInTheDocument();
    const last = onUpdate.mock.calls.at(-1)?.[0] as CostBenefit;
    expect(last.benefits.at(-1)?.text).toBe("Status symbol");
  });

  it("removes an item via the × button", () => {
    const onUpdate = vi.fn();
    render(<CostBenefitView data={sample} onUpdate={onUpdate} />);
    const removeButtons = screen.getAllByRole("button", { name: "×" });
    // first × belongs to first benefit ("Convenience")
    fireEvent.click(removeButtons[0]!);
    expect(screen.queryByText("Convenience")).not.toBeInTheDocument();
    const last = onUpdate.mock.calls.at(-1)?.[0] as CostBenefit;
    expect(last.benefits.find((b) => b.text === "Convenience")).toBeUndefined();
  });

  it("reports an evenly weighted verdict when totals are equal", () => {
    const even: CostBenefit = {
      ...sample,
      benefits: [{ text: "A", weight: 5 }],
      costs: [{ text: "B", weight: 5 }],
    };
    render(<CostBenefitView data={even} />);
    expect(screen.getByText("Evenly weighted.")).toBeInTheDocument();
  });
});
