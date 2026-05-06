import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/bayesian";
import { update } from "@/frameworks/bayesian/data";

describe("<Bayesian />", () => {
  it("posterior is greater than prior given supporting evidence in sample", () => {
    const { posterior } = update(sample);
    expect(posterior).toBeGreaterThan(sample.prior);
  });

  it("toggling observed off reverts that step", () => {
    const onUpdate = vi.fn();
    render(<View data={sample} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByTestId("bayes-obs-0"));
    expect(onUpdate.mock.calls.at(-1)?.[0].evidence[0].observed).toBe(false);
  });
});
