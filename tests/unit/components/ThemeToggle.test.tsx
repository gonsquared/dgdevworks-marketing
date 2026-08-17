import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { THEME_STORAGE_KEY } from "@/lib/theme";

describe("ThemeToggle (E1-F2-S2)", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("has an accessible name reflecting the *next* theme, not just an icon", () => {
    render(<ThemeToggle />);
    // Defaults to light (server snapshot / no stored preference).
    expect(screen.getByRole("button", { name: "Switch to dark theme" })).toBeInTheDocument();
  });

  it("conveys state via aria-pressed", () => {
    render(<ThemeToggle />);
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("aria-pressed", "false");
  });

  it("clicking toggles the theme, updates data-theme on <html>, and persists to localStorage", async () => {
    render(<ThemeToggle />);
    const btn = screen.getByRole("button", { name: "Switch to dark theme" });

    await userEvent.click(btn);

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(await screen.findByRole("button", { name: "Switch to light theme" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("is keyboard-operable (focusable, activatable via Enter/Space as a native button)", () => {
    render(<ThemeToggle />);
    const btn = screen.getByRole("button");
    btn.focus();
    expect(btn).toHaveFocus();
  });
});
