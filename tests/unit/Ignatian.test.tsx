import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/ignatian";

describe("<Ignatian />", () => {
  it("renders consolation and desolation sliders for each option", () => {
    render(<View data={sample} />);
    for (let i = 0; i < sample.options.length; i++) {
      expect(screen.getByTestId(`ig-${i}-consolation`)).toBeInTheDocument();
      expect(screen.getByTestId(`ig-${i}-desolation`)).toBeInTheDocument();
    }
  });

  it("editing a day fires onUpdate", () => {
    const onUpdate = vi.fn();
    render(<View data={sample} onUpdate={onUpdate} />);
    fireEvent.change(screen.getByTestId("ig-day-0"), { target: { value: "A" } });
    expect(onUpdate.mock.calls.at(-1)?.[0].days[0]).toBe("A");
  });
});
