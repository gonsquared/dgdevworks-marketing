import "@testing-library/jest-dom/vitest";
import { afterEach, expect, vi } from "vitest";
import { cleanup } from "@testing-library/react";
// vitest-axe@0.1.0 ships a broken (0-byte) extend-expect.js entry point, so
// register its matcher directly from matchers.js instead.
import { toHaveNoViolations } from "vitest-axe/matchers";

expect.extend({ toHaveNoViolations });

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

// jsdom doesn't implement matchMedia — framer-motion's useReducedMotion()
// and various components rely on it.
if (!window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

// jsdom never computes layout, so `offsetParent` always returns null — this
// breaks any component (like MobileNavPanel's focus trap) that uses
// `offsetParent !== null` as an "is this element visible?" check. Stub it to
// report every element as visible/attached, which is accurate for these
// tests since nothing here is intentionally `display: none`.
Object.defineProperty(HTMLElement.prototype, "offsetParent", {
  get() {
    return this.parentNode;
  },
});

// jsdom doesn't implement IntersectionObserver — framer-motion's
// whileInView (used by ScrollReveal) relies on it.
class MockIntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}
window.IntersectionObserver = MockIntersectionObserver;
global.IntersectionObserver = MockIntersectionObserver;
