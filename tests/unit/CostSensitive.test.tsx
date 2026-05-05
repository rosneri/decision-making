import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/cost-sensitive";

describe("<CostSensitive />", () => {
  it("reports an expected $ at the current threshold", () => {
    render(<View data={sample} />);
    expect(screen.getByTestId("cs-ev").textContent).toMatch(/-?\d+\.\d+/);
  });

  it("the recommended best threshold is between 0 and 1", () => {
    render(<View data={sample} />);
    const m = screen.getByTestId("cs-best").textContent?.match(/t\* = (\d\.\d{2})/);
    expect(m).not.toBeNull();
    const v = parseFloat(m![1]!);
    expect(v).toBeGreaterThanOrEqual(0);
    expect(v).toBeLessThanOrEqual(1);
  });

  it("changing baseRate updates EV", () => {
    render(<View data={sample} />);
    const before = screen.getByTestId("cs-ev").textContent;
    fireEvent.change(screen.getByTestId("cs-baserate"), { target: { value: "0.5" } });
    const after = screen.getByTestId("cs-ev").textContent;
    expect(after).not.toBe(before);
  });
});
