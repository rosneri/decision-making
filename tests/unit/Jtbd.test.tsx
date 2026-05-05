import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/jtbd";

describe("<Jtbd />", () => {
  it("renders the when/want/soThat clauses", () => {
    render(<View data={sample} />);
    expect(screen.getByTestId("jtbd-when")).toHaveValue(sample.when);
    expect(screen.getByTestId("jtbd-want")).toHaveValue(sample.want);
    expect(screen.getByTestId("jtbd-sothat")).toHaveValue(sample.soThat);
  });

  it("editing soThat fires onUpdate", () => {
    const onUpdate = vi.fn();
    render(<View data={sample} onUpdate={onUpdate} />);
    fireEvent.change(screen.getByTestId("jtbd-sothat"), { target: { value: "I survive the day" } });
    expect(onUpdate.mock.calls.at(-1)?.[0].soThat).toBe("I survive the day");
  });
});
