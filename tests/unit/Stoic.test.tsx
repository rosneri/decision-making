import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { sample, View } from "@/frameworks/stoic";

describe("<Stoic />", () => {
  it("renders both lists", () => {
    render(<View data={sample} />);
    const yours = screen.getByTestId("stoic-yours");
    const not = screen.getByTestId("stoic-not-yours");
    expect(within(yours).getAllByRole("textbox").length).toBe(sample.yours.length);
    expect(within(not).getAllByRole("textbox").length).toBe(sample.notYours.length);
  });

  it("clicking → moves an item from 'yours' to 'not yours'", () => {
    render(<View data={sample} />);
    const yours = screen.getByTestId("stoic-yours");
    const moveBtn = within(yours).getAllByLabelText("move to not yours")[0]!;
    fireEvent.click(moveBtn);
    const yoursAfter = screen.getByTestId("stoic-yours");
    expect(within(yoursAfter).getAllByRole("textbox").length).toBe(sample.yours.length - 1);
  });
});
