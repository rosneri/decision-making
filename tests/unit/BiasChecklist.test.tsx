import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/bias-checklist";

describe("<BiasChecklist />", () => {
  it("renders one row per bias", () => {
    render(<View data={sample} />);
    for (let i = 0; i < sample.biases.length; i++) {
      expect(screen.getByTestId(`bias-row-${i}`)).toBeInTheDocument();
    }
  });

  it("shows count of triggered biases", () => {
    render(<View data={sample} />);
    expect(screen.getByTestId("bias-summary").textContent).toContain("3");
  });

  it("toggling a checkbox flips triggered state", () => {
    const onUpdate = vi.fn();
    render(<View data={sample} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByTestId("bias-toggle-2"));
    expect(onUpdate.mock.calls.at(-1)?.[0].biases[2].triggered).toBe(true);
  });
});
