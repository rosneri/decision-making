import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { sample, View } from "@/frameworks/irac";

describe("<Irac />", () => {
  it("renders all four blocks", () => {
    render(<View data={sample} />);
    for (const k of ["I", "R", "A", "C"]) {
      expect(screen.getByTestId(`irac-${k}`)).toBeInTheDocument();
    }
  });

  it("editing a block fires onUpdate", () => {
    const onUpdate = vi.fn();
    render(<View data={sample} onUpdate={onUpdate} />);
    const issue = screen.getByTestId("irac-I");
    const ta = within(issue).getByRole("textbox") as HTMLTextAreaElement;
    fireEvent.change(ta, { target: { value: "different issue" } });
    expect(onUpdate.mock.calls.at(-1)?.[0].blocks.I).toBe("different issue");
  });
});
