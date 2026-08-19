import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("next/navigation", () => ({
  usePathname: () => "/services",
}));

import { Nav } from "@/components/layout/Nav";
import { navLinks } from "@/lib/navLinks";

describe("Nav (E1-F3-S2)", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders links to Home, Services, Work, About, Pricing, Contact", () => {
    render(<Nav />);
    const primaryNav = screen.getByRole("navigation", { name: "Primary" });
    for (const link of navLinks) {
      expect(within(primaryNav).getByRole("link", { name: link.label })).toHaveAttribute("href", link.href);
    }
  });

  it("renders a persistent 'Book a call' button reading NEXT_PUBLIC_BOOKING_URL, opened safely", () => {
    render(<Nav />);
    const bookLinks = screen.getAllByRole("link", { name: "Book a call" });
    expect(bookLinks.length).toBeGreaterThan(0);
    for (const link of bookLinks) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link.getAttribute("href")?.length).toBeGreaterThan(0);
    }
  });

  it("marks the active route with aria-current=page", () => {
    render(<Nav />);
    const primaryNav = screen.getByRole("navigation", { name: "Primary" });
    const activeLink = within(primaryNav).getByRole("link", { name: "Services" });
    expect(activeLink).toHaveAttribute("aria-current", "page");
    const inactiveLink = within(primaryNav).getByRole("link", { name: "Home" });
    expect(inactiveLink).not.toHaveAttribute("aria-current");
  });

  it("hamburger button is keyboard/screen-reader accessible: has an accessible name and correct aria-expanded/aria-controls wiring", async () => {
    render(<Nav />);
    const hamburger = screen.getByRole("button", { name: "Open navigation menu" });
    expect(hamburger).toHaveAttribute("aria-expanded", "false");
    expect(hamburger).toHaveAttribute("aria-controls", "mobile-nav-panel");

    await userEvent.click(hamburger);
    expect(hamburger).toHaveAttribute("aria-expanded", "true");
    // Opening the mobile panel renders a dialog per E1-F3-S2/S1 spec.
    expect(screen.getByRole("dialog", { name: "Site navigation" })).toBeInTheDocument();
  });

  it("inerts the header's own content (logo, book-a-call buttons, hamburger) while the mobile panel is open, and releases it on Escape", async () => {
    render(<Nav />);
    const hamburger = screen.getByRole("button", { name: "Open navigation menu" });

    await userEvent.click(hamburger);
    const headerContent = document.getElementById("site-header-content");
    expect(headerContent).not.toBeNull();
    expect(headerContent).toHaveAttribute("inert");
    expect(headerContent).toHaveAttribute("aria-hidden", "true");

    await userEvent.keyboard("{Escape}");
    expect(headerContent).not.toHaveAttribute("inert");
    expect(headerContent).not.toHaveAttribute("aria-hidden");
    expect(hamburger).toHaveFocus();
  });

  it("uses the 64px BROADSHEET header height", () => {
    render(<Nav />);
    const header = screen.getByRole("banner");
    expect(header).toHaveClass("h-16");
  });

  it("hamburger renders an SVG icon, not the old text glyph", () => {
    render(<Nav />);
    const hamburger = screen.getByRole("button", { name: "Open navigation menu" });
    expect(hamburger.querySelector("svg")).not.toBeNull();
    expect(screen.queryByText("☰")).not.toBeInTheDocument();
  });
});
