import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/mpt";
import { portfolio } from "@/frameworks/mpt/data";

describe("<Mpt />", () => {
  it("renders one row per asset", () => {
    render(<View data={sample} />);
    for (let i = 0; i < sample.assets.length; i++) {
      expect(screen.getByTestId(`mpt-row-${i}`)).toBeInTheDocument();
    }
  });

  it("computes a positive Sharpe for the sample", () => {
    const p = portfolio(sample);
    expect(p.sharpe).toBeGreaterThan(0);
  });

  it("editing weight fires onUpdate", () => {
    const onUpdate = vi.fn();
    render(<View data={sample} onUpdate={onUpdate} />);
    fireEvent.change(screen.getByTestId("mpt-w-0"), { target: { value: "0.6" } });
    expect(onUpdate.mock.calls.at(-1)?.[0].assets[0].weight).toBeCloseTo(0.6);
  });
});
