"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { navLinks } from "@/lib/navLinks";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/Button";
import { getBookingUrl } from "@/lib/env";

export interface MobileNavPanelProps {
  open: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Full-height slide-in mobile nav dialog: role="dialog", aria-modal="true",
 * focus-trapped, background inerted, body scroll locked, Esc closes and
 * returns focus to the hamburger trigger.
 */
export function MobileNavPanel({ open, onClose, triggerRef }: MobileNavPanelProps) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const bookingUrl = getBookingUrl();

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Inert the page content behind the dialog — both the routed page
    // content AND the header's own interactive content (logo link,
    // book-a-call buttons, hamburger trigger) — so assistive tech
    // (rotor/landmark/heading navigation, swipe gestures) and pointer
    // interaction stay confined to the panel while it's open. The panel
    // itself is a sibling of #site-header-content, never a descendant, so
    // inerting it never inerts the dialog.
    const mainContent = document.getElementById("main-content");
    const headerContent = document.getElementById("site-header-content");
    mainContent?.setAttribute("inert", "");
    mainContent?.setAttribute("aria-hidden", "true");
    headerContent?.setAttribute("inert", "");
    headerContent?.setAttribute("aria-hidden", "true");

    // Releases the inert/aria-hidden treatment. Exposed as a named function
    // (rather than only relying on the cleanup below) because the trigger
    // button lives inside #site-header-content: an inert element can't
    // receive focus, so on Escape we must release inert synchronously
    // *before* returning focus to it, ahead of the next render's cleanup.
    function releaseInert() {
      mainContent?.removeAttribute("inert");
      mainContent?.removeAttribute("aria-hidden");
      headerContent?.removeAttribute("inert");
      headerContent?.removeAttribute("aria-hidden");
    }

    const panel = panelRef.current;
    const firstFocusable = panel?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    firstFocusable?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        releaseInert();
        onClose();
        triggerRef.current?.focus();
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
    };
  }, [open, onClose, triggerRef]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="fixed inset-0 z-50 flex flex-col bg-bg md:hidden"
          initial={shouldReduceMotion ? { opacity: 1 } : { x: "100%" }}
          animate={shouldReduceMotion ? { opacity: 1 } : { x: 0 }}
          exit={shouldReduceMotion ? { opacity: 1 } : { x: "100%" }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.24, ease: "easeInOut" }}
        >
          <div className="flex items-center justify-end px-6 py-5">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-text-primary"
            >
              <span aria-hidden="true" className="text-xl leading-none">
                ×
              </span>
            </button>
          </div>

          <nav aria-label="Mobile" className="flex flex-1 flex-col gap-6 overflow-y-auto px-8 py-4">
            <ul className="flex flex-col gap-5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      aria-current={isActive ? "page" : undefined}
                      className="heading-h3 text-text-primary data-[active=true]:text-accent"
                      data-active={isActive}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-2">
              <ThemeToggle />
            </div>
          </nav>

          <div className="flex flex-col gap-3 border-t border-border px-8 py-6">
            <Button href={bookingUrl} external variant="solid" size="lg" onClick={onClose}>
              Book a call
            </Button>
            <Button href="/contact" variant="outline" size="lg" onClick={onClose}>
              Send a message
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
