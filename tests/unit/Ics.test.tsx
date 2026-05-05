import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { sample, View } from "@/frameworks/ics";

describe("<Ics />", () => {
  it("reports completion count of 4 sections when all chiefs are filled", () => {
    render(<View data={sample} />);
    expect(screen.getByTestId("ics-completion")).toHaveTextContent(/4 of 4 sections/);
  });

  it("clearing a section's chief drops the count", () => {
    render(<View data={sample} />);
    const section = screen.getByTestId("ics-section-finance");
    const chief = within(section).getAllByRole("textbox")[0]!;
    fireEvent.change(chief, { target: { value: "" } });
    expect(screen.getByTestId("ics-completion")).toHaveTextContent(/3 of 4 sections/);
  });
});
