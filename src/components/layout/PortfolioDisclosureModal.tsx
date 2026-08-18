"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { SpecLabel } from "@/components/ui/SpecLabel";
import { portfolioDisclosureCopy as copy } from "@/data/portfolioDisclosure";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

const DISMISSED_KEY = "dgdevworks-portfolio-disclosure-dismissed";
const OPEN_DELAY_MS = 300;

/** Fails open (treats as not-yet-dismissed) if sessionStorage throws, e.g. private-mode restrictions. */
function readDismissed(): boolean {
  try {
    return window.sessionStorage.getItem(DISMISSED_KEY) === "true";
  } catch {
    return false;
  }
}

/** Fails open silently — if this throws, the modal simply may reappear next mount, never crashes. */
function persistDismissed(): void {
  try {
    window.sessionStorage.setItem(DISMISSED_KEY, "true");
  } catch {
    // Intentionally ignored — see readDismissed() fail-open rationale.
  }
}

/**
 * Sitewide, once-per-session disclosure that this site is a self-built
 * portfolio project, with a direct path to /contact. Mounted as a client
 * leaf sibling of <Nav /> in src/app/layout.tsx, gated by a sessionStorage
 * flag so it shows once per browsing session regardless of entry route.
 *
 * Reuses MobileNavPanel's accessible-dialog mechanics (FOCUSABLE_SELECTOR,
 * Tab-trap, Esc handling, inert background, reduced-motion fallback) — see
 * docs/design-system.md §9 for the full spec.
 */
export function PortfolioDisclosureModal() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Decide once on mount whether to show the disclosure this session; if not
  // already dismissed, open after a 300ms settle delay so page content paints
  // first (no blocking script, unlike the theme-init script).
  useEffect(() => {
    if (readDismissed()) return;

    const timer = setTimeout(() => setOpen(true), OPEN_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    persistDismissed();
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    const previousActiveElement = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Inert the three background landmarks (header/main/footer) — one more
    // than MobileNavPanel's two, since this dialog is a sibling of all three
    // rather than living inside the header.
    const headerContent = document.getElementById("site-header-content");
    const mainContent = document.getElementById("main-content");
    const footerContent = document.getElementById("site-footer-content");
    headerContent?.setAttribute("inert", "");
    headerContent?.setAttribute("aria-hidden", "true");
    mainContent?.setAttribute("inert", "");
    mainContent?.setAttribute("aria-hidden", "true");
    footerContent?.setAttribute("inert", "");
    footerContent?.setAttribute("aria-hidden", "true");

    function releaseInert() {
      headerContent?.removeAttribute("inert");
      headerContent?.removeAttribute("aria-hidden");
      mainContent?.removeAttribute("inert");
      mainContent?.removeAttribute("aria-hidden");
      footerContent?.removeAttribute("inert");
      footerContent?.removeAttribute("aria-hidden");
    }

    // Initial focus: the close (X) button, so keyboard/screen-reader users
    // can dismiss immediately without risking an accidental Enter on the
    // primary "Get in touch" CTA.
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        dismiss();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((el) => el.offsetParent !== null);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      releaseInert();

      // Focus return on close: restore whatever had focus at open time (or
      // document.body if it's gone from the DOM). Moot when "Get in touch"
      // is the dismissal path, since the browser is about to navigate away.
      const restoreTarget =
        previousActiveElement && document.contains(previousActiveElement)
          ? previousActiveElement
          : document.body;
      restoreTarget.focus();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          onClick={dismiss}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.18, ease: "easeInOut" }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="portfolio-disclosure-heading"
            aria-describedby="portfolio-disclosure-body"
            onClick={(event) => event.stopPropagation()}
            className="card-bracket relative w-full max-w-[440px] rounded-lg border border-border bg-surface p-8"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: "easeOut" }}
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={dismiss}
              aria-label={copy.closeButtonAriaLabel}
              className="absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-text-primary"
            >
              <span aria-hidden="true" className="text-lg leading-none">
                ×
              </span>
            </button>

            <SpecLabel>{copy.eyebrow}</SpecLabel>
            <h2 id="portfolio-disclosure-heading" className="heading-h3 text-text-primary mt-3">
              {copy.heading}
            </h2>
            <p id="portfolio-disclosure-body" className="text-body text-text-secondary mt-3">
              {copy.body}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button variant="ghost" size="md" onClick={dismiss}>
                {copy.secondaryCtaLabel}
              </Button>
              <Button variant="solid" size="md" href="/contact" onClick={dismiss}>
                {copy.primaryCtaLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
