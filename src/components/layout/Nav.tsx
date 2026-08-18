"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Logotype } from "./Logotype";
import { ThemeToggle } from "./ThemeToggle";
import { MobileNavPanel } from "./MobileNavPanel";
import { Button } from "@/components/ui/Button";
import { navLinks } from "@/lib/navLinks";
import { getBookingUrl } from "@/lib/env";

/**
 * Sticky global nav: Logotype, desktop link list with active-route
 * underline tick, ThemeToggle, persistent "Book a call" button, and a
 * mobile hamburger that opens the full-height MobileNavPanel dialog.
 * Rendered once in the root layout so it appears on every route.
 */
export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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
        "sticky top-0 z-40 h-[72px] border-b bg-bg transition-colors",
        scrolled ? "border-border-strong" : "border-border"
      )}
    >
      {/* id targeted by MobileNavPanel to inert the header's own interactive
          content (logo link, book-a-call buttons, hamburger) while the
          mobile dialog is open — the panel itself lives in a sibling node
          below, outside this subtree, so inerting this div never inerts
          the dialog. */}
      <div
        id="site-header-content"
        className="mx-auto flex h-full w-full max-w-[1200px] items-center justify-between px-6 md:px-8 lg:px-10"
      >
        <Logotype />

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={clsx(
                      "relative py-2 text-ui text-text-secondary transition-colors hover:text-text-primary",
                      isActive && "text-text-primary"
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-0.5 left-0 h-0.5 w-full bg-accent"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle className="hidden md:inline-flex" />
          <Button href={bookingUrl} external size="sm" className="hidden md:inline-flex">
            Book a call
          </Button>

          {/* Mobile: booking CTA + hamburger stay visible on the bar. */}
          <Button href={bookingUrl} external size="sm" className="md:hidden">
            Book a call
          </Button>
          <button
            ref={hamburgerRef}
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-text-primary md:hidden"
          >
            <span aria-hidden="true" className="text-lg leading-none">
              ☰
            </span>
          </button>
        </div>
      </div>

      <div id="mobile-nav-panel">
        <MobileNavPanel
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          triggerRef={hamburgerRef}
        />
      </div>
    </header>
  );
}
