import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/grade";

describe("<Grade />", () => {
  it("toggling strength updates onUpdate", () => {
    const onUpdate = vi.fn();
    render(<View data={sample} onUpdate={onUpdate} />);
    fireEvent.change(screen.getByTestId("grade-strength"), { target: { value: "strong" } });
    expect(onUpdate.mock.calls.at(-1)?.[0].strength).toBe("strong");
  });

  it("renders one row per study", () => {
    render(<View data={sample} />);
    for (let i = 0; i < sample.studies.length; i++) {
      expect(screen.getByTestId(`grade-study-${i}`)).toBeInTheDocument();
    }
  });
});
