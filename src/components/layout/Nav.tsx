"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Logotype } from "./Logotype";
import { ThemeToggle } from "./ThemeToggle";
import { MobileNavPanel } from "./MobileNavPanel";
import { Button } from "@/components/ui/Button";
import { navLinks } from "@/lib/navLinks";
import { getBookingUrl } from "@/lib/env";

/**
 * Sticky global nav: Logotype, desktop link list with a pill
 * that glides between hovered/active links, ThemeToggle, persistent
 * "Book a call" button, and a mobile hamburger that opens the full-height
 * MobileNavPanel dialog. Rendered once in the root layout so it appears on
 * every route.
 */
export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();
  // Tracks the pathname the mobile panel's open state was last computed
  // for, so we can reset it during render on route change (React's
  // recommended "adjusting state during rendering" pattern) instead of
  // calling setState synchronously inside an effect.
  const [lastPathname, setLastPathname] = useState(pathname);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const bookingUrl = getBookingUrl();

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "material-chrome sticky top-0 z-40 h-16 border-b transition-[border-color] duration-300 ease-out relative",
        scrolled ? "border-rule" : "border-transparent"
      )}
    >
      {/* id targeted by MobileNavPanel to inert the header's own interactive
          content (logo link, book-a-call button, hamburger) while the
          mobile dialog is open — the panel itself lives in a sibling node
          below, outside this subtree, so inerting this div never inerts
          the dialog. */}
      <div
        id="site-header-content"
        className="mx-auto flex h-full w-full max-w-[1240px] items-center justify-between px-6 md:px-10"
      >
        <Logotype />

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1" onMouseLeave={() => setHovered(null)}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const showPill = hovered ? hovered === link.href : isActive;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    onMouseEnter={() => setHovered(link.href)}
                    onFocus={() => setHovered(link.href)}
                    onBlur={() => setHovered(null)}
                    className={clsx(
                      "relative isolate flex items-center rounded-full px-3.5 py-2 text-ui transition-colors duration-150",
                      isActive || hovered === link.href ? "text-text-primary" : "text-text-secondary"
                    )}
                  >
                    {showPill && (
                      <motion.span
                        aria-hidden="true"
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-wash"
                        transition={
                          shouldReduceMotion ? { duration: 0 } : { type: "spring", bounce: 0.12, duration: 0.4 }
                        }
                      />
                    )}
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden md:inline-flex" />
          <Button href={bookingUrl} external size="sm">
            Book a call
          </Button>
          <button
            ref={hamburgerRef}
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-control border border-border text-text-primary transition-transform duration-75 active:scale-95 motion-reduce:active:scale-100 md:hidden"
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none">
              <path d="M2.5 6h15M2.5 14h15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      <div id="mobile-nav-panel">
        <MobileNavPanel open={mobileOpen} onClose={() => setMobileOpen(false)} triggerRef={hamburgerRef} />
      </div>
    </header>
  );
}
