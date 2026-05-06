import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/dime";

describe("<Dime />", () => {
  it("renders all four instruments", () => {
    render(<View data={sample} />);
    for (const k of ["Diplomatic", "Information", "Military", "Economic"]) {
      expect(screen.getByTestId(`dime-${k}`)).toBeInTheDocument();
    }
  });

  it("clicking a cell sets emphasis", () => {
    const onUpdate = vi.fn();
    render(<View data={sample} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByTestId("dime-Military"));
    expect(onUpdate.mock.calls.at(-1)?.[0].emphasis).toBe("Military");
  });
});
