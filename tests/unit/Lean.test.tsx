import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/lean";

describe("<Lean />", () => {
  it("renders cycle number and decision", () => {
    render(<View data={sample} />);
    expect(screen.getByTestId("lean-cycle")).toHaveTextContent(String(sample.cycle));
  });

  it("clicking 'Next cycle' increments the counter", () => {
    render(<View data={sample} />);
    fireEvent.click(screen.getByTestId("lean-next-cycle"));
    expect(screen.getByTestId("lean-cycle")).toHaveTextContent(String(sample.cycle + 1));
  });

  it("changing decision fires onUpdate with new value", () => {
    const onUpdate = vi.fn();
    render(<View data={sample} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByTestId("lean-decision-kill"));
    expect(onUpdate.mock.calls.at(-1)?.[0].decision).toBe("kill");
  });
});
