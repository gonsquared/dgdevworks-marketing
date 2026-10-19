import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Masthead } from "@/components/Masthead";

describe("Masthead (BROADSHEET home hero, replaces Hero)", () => {
  it("renders the masthead headline, all 4 practice facts, and a tiered CTA pair", () => {
    render(<Masthead />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Production software, built by one senior engineer.",
    );
    for (const label of ["Practice", "Stack", "Engagements", "Response"]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
    const bookLink = screen.getByRole("link", { name: "Book a call" });
    expect(bookLink).toHaveAttribute("target", "_blank");
    expect(bookLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(
      screen.getByRole("link", { name: "See the work" }),
    ).toHaveAttribute("href", "/work");
  });
});
