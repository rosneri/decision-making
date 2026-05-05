import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { View as SwotView } from "@/frameworks/swot";
import type { Swot } from "@/frameworks";

const sample: Swot = {
  framework: "swot",
  category: "Strategy & business",
  title: "Test SWOT",
  strengths: ["Strong team"],
  weaknesses: ["Limited budget"],
  opportunities: ["Growing market"],
  threats: ["Competitor X"],
  recommendation: "Move fast.",
};

describe("<SwotView />", () => {
  it("renders all four quadrants with their items", () => {
    render(<SwotView data={sample} />);
    expect(screen.getByDisplayValue("Strong team")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Limited budget")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Growing market")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Competitor X")).toBeInTheDocument();
    expect(screen.getByText("Strengths")).toBeInTheDocument();
    expect(screen.getByText("Weaknesses")).toBeInTheDocument();
    expect(screen.getByText("Opportunities")).toBeInTheDocument();
    expect(screen.getByText("Threats")).toBeInTheDocument();
  });

  it("edits an existing item and notifies onUpdate", () => {
    const onUpdate = vi.fn();
    render(<SwotView data={sample} onUpdate={onUpdate} />);
    const input = screen.getByDisplayValue("Strong team");
    fireEvent.change(input, { target: { value: "Stellar team" } });
    expect(screen.getByDisplayValue("Stellar team")).toBeInTheDocument();
    expect(onUpdate).toHaveBeenCalled();
    const last = onUpdate.mock.calls.at(-1)?.[0] as Swot;
    expect(last.strengths[0]).toBe("Stellar team");
  });

  it("adds a new empty item to a quadrant", () => {
    render(<SwotView data={sample} />);
    const addButtons = screen.getAllByText("+ add");
    expect(addButtons).toHaveLength(4);
    fireEvent.click(addButtons[0]!);
    // Now strengths has 2 items: index 02 should appear
    expect(screen.getByText("·02")).toBeInTheDocument();
  });

  it("removes an item via the × button", () => {
    const onUpdate = vi.fn();
    render(<SwotView data={sample} onUpdate={onUpdate} />);
    const removeButtons = screen.getAllByRole("button", { name: "×" });
    expect(removeButtons.length).toBeGreaterThanOrEqual(4);
    fireEvent.click(removeButtons[0]!);
    expect(screen.queryByDisplayValue("Strong team")).not.toBeInTheDocument();
    const last = onUpdate.mock.calls.at(-1)?.[0] as Swot;
    expect(last.strengths).toEqual([]);
  });
});
