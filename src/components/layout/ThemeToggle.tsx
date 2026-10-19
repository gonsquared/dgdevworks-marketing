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
 * useSyncExternalStore (server snapshot "dark" during SSR/hydration,
 * swapping to the real client value in one follow-up render) — the
 * framework-native equivalent of a manual `mounted` guard, avoiding
 * hydration mismatches without a useState+useEffect dance.
 */
export function ThemeToggle({ className = "inline-flex" }: ThemeToggleProps) {
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
        "h-9 w-9 items-center justify-center rounded-full text-text-secondary transition-[color,background-color,transform] duration-150 active:scale-95 motion-reduce:active:scale-100 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-wash [@media(hover:hover)_and_(pointer:fine)]:hover:text-text-primary",
        className
      )}
    >
      {isDark ? (
        <svg aria-hidden="true" viewBox="0 0 20 20" className="h-[1.125rem] w-[1.125rem]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="10" cy="10" r="3.25" />
          <path d="M10 2.5v1.75M10 15.75v1.75M2.5 10h1.75M15.75 10h1.75M4.7 4.7l1.24 1.24M14.06 14.06l1.24 1.24M4.7 15.3l1.24-1.24M14.06 5.94l1.24-1.24" />
        </svg>
      ) : (
        <svg aria-hidden="true" viewBox="0 0 20 20" className="h-[1.125rem] w-[1.125rem]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
          <path d="M16.5 11.6A6.75 6.75 0 0 1 8.4 3.5a6.75 6.75 0 1 0 8.1 8.1Z" />
        </svg>
      )}
    </button>
  );
}
