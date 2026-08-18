export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "dgdevworks-theme";

/**
 * Blocking inline script source, injected via a plain <script> tag in the
 * root layout's <head> (before first paint) to set data-theme on <html>
 * and avoid a flash of incorrect theme. This string is a static, hardcoded
 * constant — never interpolates user input — so rendering it via
 * dangerouslySetInnerHTML does not introduce an XSS surface.
 */
export const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    var theme = stored === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();
`;

type ThemeListener = () => void;
const listeners = new Set<ThemeListener>();

export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // localStorage may be unavailable (private browsing, disabled storage) —
    // theme still applies for the current session via the DOM attribute.
  }
  listeners.forEach((listener) => listener());
}

export function readStoredTheme(): Theme {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

/**
 * useSyncExternalStore bindings for reading the current theme. This avoids
 * the classic useState+useEffect+"mounted" flag dance (and its associated
 * setState-in-effect lint warnings) while still giving each theme-dependent
 * component a hydration-safe way to read the real (client-only) theme
 * value: React renders the deterministic server snapshot ("dark") through
 * hydration, then swaps to the real client snapshot in a single follow-up
 * render — the same hydration-mismatch protection a manual `mounted` guard
 * provides, via the framework-native primitive built for this exact case.
 */
export function subscribeTheme(onStoreChange: ThemeListener): () => void {
  listeners.add(onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function getThemeSnapshot(): Theme {
  return readStoredTheme();
}

export function getServerThemeSnapshot(): Theme {
  return "dark";
}
