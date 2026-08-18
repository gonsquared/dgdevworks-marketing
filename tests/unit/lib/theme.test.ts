import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  applyTheme,
  getServerThemeSnapshot,
  getThemeSnapshot,
  readStoredTheme,
  themeInitScript,
  THEME_STORAGE_KEY,
} from "@/lib/theme";

describe("src/lib/theme.ts (E1-F2-S2 theming mechanism)", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("themeInitScript is a static string containing no template-interpolated user input (XSS-safe to inline via dangerouslySetInnerHTML)", () => {
    expect(themeInitScript).toContain("data-theme");
    expect(themeInitScript).toContain(THEME_STORAGE_KEY);
    // Should not contain obvious script-injection markers beyond its own <script> logic.
    expect(themeInitScript).not.toMatch(/\$\{/);
  });

  it("themeInitScript defaults to dark when nothing is stored and dark when storage throws", () => {
    // Assert against the actual script string, not a re-implementation of
    // its logic — a tautological version of this test would always pass.
    expect(themeInitScript).toContain('stored === "light" ? "light" : "dark"');
    expect(themeInitScript).toMatch(/catch[\s\S]*"dark"/);
  });

  it("getServerThemeSnapshot always returns 'dark' (deterministic SSR snapshot, avoids hydration mismatch)", () => {
    expect(getServerThemeSnapshot()).toBe("dark");
  });

  it("readStoredTheme defaults to 'dark' when nothing is stored", () => {
    expect(readStoredTheme()).toBe("dark");
  });

  it("readStoredTheme returns 'light' only when explicitly stored as 'light'", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "light");
    expect(readStoredTheme()).toBe("light");
  });

  it("readStoredTheme treats any non-'light' stored value as dark (defensive default)", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "not-a-real-theme");
    expect(readStoredTheme()).toBe("dark");
  });

  it("applyTheme sets the data-theme attribute on <html> and persists to localStorage", () => {
    applyTheme("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");

    applyTheme("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
  });

  it("applyTheme does not throw when localStorage is unavailable (private browsing) and still applies the DOM attribute", () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("storage disabled");
    });
    expect(() => applyTheme("dark")).not.toThrow();
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    spy.mockRestore();
  });

  it("getThemeSnapshot reflects the current stored theme (used by useSyncExternalStore)", () => {
    applyTheme("dark");
    expect(getThemeSnapshot()).toBe("dark");
  });
});
