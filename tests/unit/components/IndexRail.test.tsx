import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { IndexRail } from "@/components/ui/IndexRail";

describe("IndexRail primitive (BROADSHEET foundation)", () => {
  it("renders the section number and label as static text", () => {
    render(<IndexRail number="02" label="PROOF OF WORK" />);
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("PROOF OF WORK")).toBeInTheDocument();
  });

  it("is sticky at the lg breakpoint and inline below it (no JS required for the label to be present)", () => {
    const { container } = render(<IndexRail number="01" label="SERVICES" />);
    expect(container.firstChild).toHaveClass("lg:sticky");
  });
});
