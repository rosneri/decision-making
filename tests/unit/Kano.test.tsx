import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { sample, View } from "@/frameworks/kano";

describe("<Kano />", () => {
  it("places features into category buckets", () => {
    render(<View data={sample} />);
    const must = screen.getByTestId("kano-bucket-must");
    expect(within(must).getByText("login works")).toBeInTheDocument();
  });

  it("changing category moves feature between buckets", () => {
    render(<View data={sample} />);
    const select = screen.getByLabelText("category for login works") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "delighter" } });
    const delighter = screen.getByTestId("kano-bucket-delighter");
    expect(within(delighter).getByText("login works")).toBeInTheDocument();
  });
});
