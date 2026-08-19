import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Logotype } from "@/components/layout/Logotype";

describe("Logotype (BROADSHEET chrome, drawn bracket mark replaces the mono [DG] text)", () => {
  it("links home with an accessible name, and renders the bracket mark decoratively", () => {
    const { container } = render(<Logotype />);
    const link = screen.getByRole("link", { name: "DG DevWorks, home" });
    expect(link).toHaveAttribute("href", "/");
    expect(screen.getByText("DevWorks")).toBeInTheDocument();
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });
});
