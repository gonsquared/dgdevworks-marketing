"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SpecLabel } from "@/components/ui/SpecLabel";
import { business } from "@/data/business";
import { PRIVACY_HASH, PRIVACY_LAST_UPDATED, formatPrivacyDate, getPrivacySections } from "@/data/privacy";
import { getGaId } from "@/lib/env";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

const BACKGROUND_LANDMARK_IDS = ["site-header-content", "main-content", "site-footer-content"];

export interface PrivacyPolicyModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Full privacy policy in an accessible modal dialog. Content comes from
 * src/data/privacy.ts. It follows the same dialog mechanics as
 * PortfolioDisclosureModal (focus trap, Esc, backdrop click, inert background,
 * reduced-motion fallback), with two differences: it's portalled to
 * document.body, because triggers live inside <main>/<footer> and those get
 * inerted, and its panel scrolls because the policy is long.
 */
export function PrivacyPolicyModal({ open, onClose }: PrivacyPolicyModalProps) {
  const headingId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // The GA disclosure renders only when analytics is enabled for this build,
  // so the policy never claims tracking that isn't happening.
  const sections = getPrivacySections({ analyticsEnabled: Boolean(getGaId()) });

  useEffect(() => {
    if (!open) return;

    const previousActiveElement = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const landmarks = BACKGROUND_LANDMARK_IDS.map((id) => document.getElementById(id));
    for (const el of landmarks) {
      el?.setAttribute("inert", "");
      el?.setAttribute("aria-hidden", "true");
    }

    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
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
      for (const el of landmarks) {
        el?.removeAttribute("inert");
        el?.removeAttribute("aria-hidden");
      }
      const restoreTarget =
        previousActiveElement && document.contains(previousActiveElement) ? previousActiveElement : document.body;
      restoreTarget.focus();
    };
  }, [open]);

  // Only portal while open: the closed state renders nothing on server and
  // client alike, so there's no hydration mismatch (open is never true on
  // first render; the #privacy hash is read in an effect).
  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          onClick={onClose}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.18, ease: "easeInOut" }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={headingId}
            onClick={(event) => event.stopPropagation()}
            className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-border bg-surface"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: "easeOut" }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-rule px-6 py-5 sm:px-8">
              <div>
                <SpecLabel>PRIVACY</SpecLabel>
                <h2 id={headingId} className="heading-h3 text-text-primary mt-2">
                  Privacy Policy
                </h2>
                <p className="font-mono-annotation text-text-secondary mt-2 normal-case tracking-normal">
                  Last updated: <time dateTime={PRIVACY_LAST_UPDATED}>{formatPrivacyDate()}</time>
                </p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close privacy policy"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-text-primary"
              >
                <span aria-hidden="true" className="text-lg leading-none">
                  ×
                </span>
              </button>
            </div>

            {/* Scrollable body: tabIndex makes it keyboard-scrollable (axe scrollable-region-focusable). */}
            <div tabIndex={0} className="overflow-y-auto px-6 py-6 sm:px-8" aria-label="Privacy policy content">
              <p className="text-body text-text-secondary">
                This policy explains what personal information {business.brandName} collects through this website,
                why, who it&apos;s shared with, and the choices you have. The short version: anything you send is
                used only to reply to you.
              </p>

              <div className="mt-8 flex flex-col gap-8">
                {sections.map((section) => (
                  <section key={section.id} aria-labelledby={`${headingId}-${section.id}`}>
                    <h3 id={`${headingId}-${section.id}`} className="heading-h4 text-text-primary">
                      {section.heading}
                    </h3>
                    {section.paragraphs?.map((paragraph) => (
                      <p key={paragraph} className="text-body text-text-secondary mt-3">
                        {paragraph}
                      </p>
                    ))}
                    {section.items && (
                      <ul className="text-body text-text-secondary mt-3 flex list-disc flex-col gap-2 pl-6">
                        {section.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )}
                    {section.after?.map((paragraph) => (
                      <p key={paragraph} className="text-body text-text-secondary mt-3">
                        {paragraph}
                      </p>
                    ))}
                  </section>
                ))}
              </div>

              <p className="text-body text-text-secondary mt-10 border-t border-rule pt-6">
                Questions or requests about your data:{" "}
                <a href={`mailto:${business.contactEmail}`} className="text-accent hover:text-accent-hover">
                  {business.contactEmail}
                </a>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export interface PrivacyPolicyLinkProps {
  children?: ReactNode;
  /** Replaces (rather than merges with) the default inline-link styling. */
  className?: string;
  /**
   * Also open when the URL hash is #privacy, so the policy stays linkable
   * (e.g. dgdevworks.com/#privacy). Enable on exactly one sitewide instance
   * (the footer) so the hash never opens two dialogs.
   */
  openOnHash?: boolean;
}

/** Inline, link-styled button that opens the privacy policy modal. */
export function PrivacyPolicyLink({
  children = "Privacy Policy",
  className,
  openOnHash = false,
}: PrivacyPolicyLinkProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!openOnHash) return;
    function syncFromHash() {
      if (window.location.hash === `#${PRIVACY_HASH}`) setOpen(true);
    }
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [openOnHash]);

  function close() {
    setOpen(false);
    // Drop a #privacy deep-link hash on close so reloads don't reopen it.
    if (window.location.hash === `#${PRIVACY_HASH}`) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className={clsx(
          "cursor-pointer",
          className ?? "text-accent underline underline-offset-2 hover:text-accent-hover"
        )}
      >
        {children}
      </button>
      <PrivacyPolicyModal open={open} onClose={close} />
    </>
  );
}
