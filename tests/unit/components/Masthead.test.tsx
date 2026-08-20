import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Masthead } from "@/components/Masthead";

describe("Masthead (BROADSHEET home hero, replaces Hero)", () => {
  it("renders the masthead headline, dateline, all 4 info items, and a tiered CTA pair", () => {
    render(<Masthead />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "From Ideas to Solutions.",
    );
    expect(screen.getByText(/LET'S WORK TOGETHER/)).toBeInTheDocument();
    for (const label of ["PRACTICE", "STACK", "ENGAGEMENT", "RESPONSE"]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
    const bookLink = screen.getByRole("link", { name: "Book a call" });
    expect(bookLink).toHaveAttribute("target", "_blank");
    expect(bookLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(
      screen.getByRole("link", { name: /See the case studies/ }),
    ).toHaveAttribute("href", "/work");
  });
});
