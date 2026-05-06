import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/categorical-imperative";

describe("<CategoricalImperative />", () => {
  it("renders all three tests", () => {
    render(<View data={sample} />);
    for (const t of ["universalize", "humanity", "kingdom"]) {
      expect(screen.getByTestId(`ci-${t}`)).toBeInTheDocument();
    }
  });

  it("toggling a test flips passes and updates summary", () => {
    const onUpdate = vi.fn();
    render(<View data={sample} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByTestId("ci-toggle-universalize"));
    expect(onUpdate.mock.calls.at(-1)?.[0].tests.universalize.passes).toBe(true);
  });
});
