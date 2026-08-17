"use client";

import { useSyncExternalStore } from "react";
import clsx from "clsx";
import {
  applyTheme,
  getServerThemeSnapshot,
  getThemeSnapshot,
  subscribeTheme,
  type Theme,
} from "@/lib/theme";

export interface ThemeToggleProps {
  className?: string;
}

/**
 * Light/dark theme toggle icon button. Reads the current theme via
 * useSyncExternalStore (server snapshot "light" during SSR/hydration,
 * swapping to the real client value in one follow-up render) — the
 * framework-native equivalent of a manual `mounted` guard, avoiding
 * hydration mismatches without a useState+useEffect dance.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const theme: Theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerThemeSnapshot);

  function toggle() {
    applyTheme(theme === "light" ? "dark" : "light");
  }

  const isDark = theme === "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      aria-label={label}
      title={label}
      className={clsx(
        "inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-text-secondary transition-colors hover:border-accent hover:text-accent",
        className
      )}
    >
      <span aria-hidden="true" className="text-base leading-none">
        {isDark ? "☀" : "☾"}
      </span>
    </button>
  );
}
