import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/dmaic";

describe("<Dmaic />", () => {
  it("renders all five phases", () => {
    render(<View data={sample} />);
    for (const p of ["D", "M", "A", "I", "C"]) {
      expect(screen.getByTestId(`dmaic-${p}`)).toBeInTheDocument();
    }
  });

  it("clicking a tab changes current phase", () => {
    const onUpdate = vi.fn();
    render(<View data={sample} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByTestId("dmaic-tab-A"));
    expect(onUpdate.mock.calls.at(-1)?.[0].current).toBe("A");
  });
});
