import { describe, it, expect } from "vitest";

/**
 * Programmatic WCAG 2.1 contrast-ratio verification of the token pairs
 * documented in docs/design-system.md §4, sourced from the actual runtime
 * values in src/app/globals.css. This supplements (does not replace) a
 * live-browser contrast check — see E6-F1-S3 accessibility audit notes for
 * the full picture given this environment's Playwright/browser constraint.
 */

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hexToRgb(hex1));
  const l2 = relativeLuminance(hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Values transcribed from src/app/globals.css (must stay in sync with the
// live stylesheet — a mismatch here would itself be worth flagging).
const LIGHT = {
  bg: "#f7f6f3",
  surface: "#ffffff",
  textPrimary: "#16191d",
  textSecondary: "#5c6470",
  accent: "#c7360f",
  accentOnFill: "#ffffff",
};

const DARK = {
  bg: "#0d1420",
  surface: "#141c2c",
  textPrimary: "#edeff3",
  textSecondary: "#94a0b4",
  accent: "#ff6a45",
  accentOnFill: "#0d1420",
};

describe("Color contrast — light theme (docs/design-system.md §4/§7)", () => {
  it("text-primary on bg meets 4.5:1 AA for normal text", () => {
    expect(contrastRatio(LIGHT.textPrimary, LIGHT.bg)).toBeGreaterThanOrEqual(4.5);
  });

  it("text-secondary on surface meets 4.5:1 AA for normal text", () => {
    expect(contrastRatio(LIGHT.textSecondary, LIGHT.surface)).toBeGreaterThanOrEqual(4.5);
  });

  it("accent on surface (links/CTAs) meets at least 4.5:1 AA", () => {
    expect(contrastRatio(LIGHT.accent, LIGHT.surface)).toBeGreaterThanOrEqual(4.5);
  });

  it("accent-on-fill on accent (solid button text) meets at least 4.5:1 AA", () => {
    expect(contrastRatio(LIGHT.accentOnFill, LIGHT.accent)).toBeGreaterThanOrEqual(4.5);
  });
});

describe("Color contrast — dark theme (docs/design-system.md §4/§7)", () => {
  it("text-primary on bg meets 4.5:1 AA for normal text", () => {
    expect(contrastRatio(DARK.textPrimary, DARK.bg)).toBeGreaterThanOrEqual(4.5);
  });

  it("text-secondary on surface meets 4.5:1 AA for normal text", () => {
    expect(contrastRatio(DARK.textSecondary, DARK.surface)).toBeGreaterThanOrEqual(4.5);
  });

  it("accent on bg (links/CTAs) meets at least 4.5:1 AA", () => {
    expect(contrastRatio(DARK.accent, DARK.bg)).toBeGreaterThanOrEqual(4.5);
  });

  it("accent-on-fill on accent (solid button text) meets at least 4.5:1 AA", () => {
    expect(contrastRatio(DARK.accentOnFill, DARK.accent)).toBeGreaterThanOrEqual(4.5);
  });
});
