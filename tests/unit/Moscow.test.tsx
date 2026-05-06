import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/moscow";

describe("<Moscow />", () => {
  it("renders all four buckets", () => {
    render(<View data={sample} />);
    for (const b of ["must", "should", "could", "wont"]) {
      expect(screen.getByTestId(`moscow-${b}`)).toBeInTheDocument();
    }
  });

  it("changing bucket reassigns the item", () => {
    const onUpdate = vi.fn();
    render(<View data={sample} onUpdate={onUpdate} />);
    fireEvent.change(screen.getByTestId("moscow-bucket-0"), { target: { value: "should" } });
    expect(onUpdate.mock.calls.at(-1)?.[0].items[0].bucket).toBe("should");
  });
});
