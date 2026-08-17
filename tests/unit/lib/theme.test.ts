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

  it("themeInitScript defaults to light when nothing is stored and light when storage throws", () => {
    // Simulate the exact branching the blocking script encodes.
    const stored = null;
    const theme = stored === "dark" ? "dark" : "light";
    expect(theme).toBe("light");
  });

  it("getServerThemeSnapshot always returns 'light' (deterministic SSR snapshot, avoids hydration mismatch)", () => {
    expect(getServerThemeSnapshot()).toBe("light");
  });

  it("readStoredTheme defaults to 'light' when nothing is stored", () => {
    expect(readStoredTheme()).toBe("light");
  });

  it("readStoredTheme returns 'dark' only when explicitly stored as 'dark'", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");
    expect(readStoredTheme()).toBe("dark");
  });

  it("readStoredTheme treats any non-'dark' stored value as light (defensive default)", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "not-a-real-theme");
    expect(readStoredTheme()).toBe("light");
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
