import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { sample, View } from "@/frameworks/odyssey";

describe("<Odyssey />", () => {
  it("renders three plans", () => {
    render(<View data={sample} />);
    for (let i = 0; i < 3; i++) expect(screen.getByTestId(`odyssey-plan-${i}`)).toBeInTheDocument();
  });

  it("clicking 'set preferred' on another plan updates state", () => {
    const onUpdate = vi.fn();
    render(<View data={sample} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByTestId("odyssey-prefer-0"));
    expect(onUpdate.mock.calls.at(-1)?.[0].preferred).toBe(0);
  });

  it("the preferred plan shows ★ preferred", () => {
    render(<View data={sample} />);
    const preferred = screen.getByTestId(`odyssey-plan-${sample.preferred}`);
    expect(within(preferred).getByText(/★ preferred/i)).toBeInTheDocument();
  });
});
