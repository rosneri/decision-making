import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/fmea";
import { rpn } from "@/frameworks/fmea/data";

describe("<Fmea />", () => {
  it("renders one row per mode", () => {
    render(<View data={sample} />);
    for (let i = 0; i < sample.modes.length; i++) {
      expect(screen.getByTestId(`fmea-row-${i}`)).toBeInTheDocument();
    }
  });

  it("computes RPN as S×O×D", () => {
    expect(rpn(sample.modes[0]!)).toBe(9 * 4 * 3);
  });

  it("editing severity fires onUpdate with clamped value", () => {
    const onUpdate = vi.fn();
    render(<View data={sample} onUpdate={onUpdate} />);
    fireEvent.change(screen.getByTestId("fmea-s-0"), { target: { value: "20" } });
    expect(onUpdate.mock.calls.at(-1)?.[0].modes[0].severity).toBe(10);
  });
});
