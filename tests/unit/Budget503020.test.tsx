import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/budget-503020";

describe("<Budget503020 />", () => {
  it("editing income fires onUpdate", () => {
    const onUpdate = vi.fn();
    render(<View data={sample} onUpdate={onUpdate} />);
    fireEvent.change(screen.getByTestId("budget-income"), { target: { value: "6000" } });
    expect(onUpdate.mock.calls.at(-1)?.[0].income).toBe(6000);
  });

  it("editing actuals fires onUpdate with new save value", () => {
    const onUpdate = vi.fn();
    render(<View data={sample} onUpdate={onUpdate} />);
    fireEvent.change(screen.getByTestId("budget-save"), { target: { value: "1000" } });
    expect(onUpdate.mock.calls.at(-1)?.[0].actuals.save).toBe(1000);
  });
});
