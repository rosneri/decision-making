import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { sample, View } from "@/frameworks/sunk-cost";

describe("<SunkCost />", () => {
  it("renders sunk + forward options", () => {
    render(<View data={sample} />);
    const sunk = screen.getByTestId("sunk-block");
    expect(within(sunk).getByDisplayValue(sample.sunk.value)).toBeInTheDocument();
    for (let i = 0; i < sample.options.length; i++) {
      expect(screen.getByTestId(`sunk-option-${i}`)).toBeInTheDocument();
    }
  });

  it("editing forward EV fires onUpdate", () => {
    const onUpdate = vi.fn();
    render(<View data={sample} onUpdate={onUpdate} />);
    fireEvent.change(screen.getByTestId("sunk-ev-0"), { target: { value: "120" } });
    expect(onUpdate.mock.calls.at(-1)?.[0].options[0]?.expectedValue).toBe(120);
  });

  it("the higher-EV option is highlighted", () => {
    render(<View data={sample} />);
    // sample option 1 (Quit) has higher EV
    const opt1 = screen.getByTestId("sunk-option-1");
    expect(within(opt1).getByDisplayValue("Quit")).toHaveClass("text-vermilion");
  });
});
