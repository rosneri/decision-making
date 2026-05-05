import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { sample, View } from "@/frameworks/five-forces";

describe("<FiveForces />", () => {
  it("renders all five forces", () => {
    render(<View data={sample} />);
    for (const k of ["rivalry", "newEntrants", "suppliers", "buyers", "substitutes"]) {
      expect(screen.getByTestId(`force-${k}`)).toBeInTheDocument();
    }
  });

  it("clicking a level dot updates that force", () => {
    const onUpdate = vi.fn();
    render(<View data={sample} onUpdate={onUpdate} />);
    const buyers = screen.getByTestId("force-buyers");
    const dots = within(buyers).getAllByRole("button");
    // click "set level 5"
    fireEvent.click(dots.find((b) => b.getAttribute("aria-label") === "set level 5")!);
    expect(onUpdate.mock.calls.at(-1)?.[0].forces.buyers.level).toBe(5);
  });
});
