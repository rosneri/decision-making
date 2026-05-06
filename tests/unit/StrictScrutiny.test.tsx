import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/strict-scrutiny";

describe("<StrictScrutiny />", () => {
  it("verdict shows 'Law fails' when any prong fails", () => {
    render(<View data={sample} />);
    expect(screen.getByTestId("scrutiny-verdict")).toHaveTextContent("Law fails");
  });

  it("toggling a prong fires onUpdate", () => {
    const onUpdate = vi.fn();
    render(<View data={sample} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByTestId("scrutiny-toggle-tailoring"));
    expect(onUpdate.mock.calls.at(-1)?.[0].prongs.tailoring.satisfied).toBe(true);
  });
});
