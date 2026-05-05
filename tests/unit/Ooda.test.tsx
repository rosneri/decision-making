import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/ooda";

describe("<Ooda />", () => {
  it("clicking a stage tab makes it current", () => {
    const onUpdate = vi.fn();
    render(<View data={sample} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByTestId("ooda-decide"));
    expect(onUpdate.mock.calls.at(-1)?.[0].current).toBe("decide");
  });

  it("notes are scoped per stage", () => {
    render(<View data={sample} />);
    expect(screen.getByTestId("ooda-current-notes")).toHaveValue(sample.notes[sample.current] ?? "");
  });
});
