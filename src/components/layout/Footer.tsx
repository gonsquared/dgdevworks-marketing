import Link from "next/link";
import { Logotype } from "./Logotype";
import { navLinks } from "@/lib/navLinks";
import { business } from "@/data/business";
import { Container } from "@/components/ui/Section";

const YEAR = new Date().getFullYear();

const linkClasses =
  "text-ui text-text-secondary transition-colors duration-150 [@media(hover:hover)_and_(pointer:fine)]:hover:text-text-primary";

/**
 * Global footer: brand block, Site links, Connect (external, safe-linked)
 * links, and a short trust note with the repeated "Book a call" link.
 * Rendered once in the root layout so it appears on every route.
 */
export function Footer() {
  return (
    <footer id="site-footer-content" role="contentinfo" className="bg-surface-sunken">
      <Container>
        <div className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-5">
            <Logotype />
            <p className="text-body text-text-secondary mt-5 max-w-sm">{business.tagline}</p>
            <a
              href={`mailto:${business.contactEmail}`}
              className="text-ui text-text-primary link-underline mt-5 inline-block"
            >
              {business.contactEmail}
            </a>
          </div>

          <nav aria-label="Site" className="lg:col-span-2">
            <p className="text-ui text-text-primary">Site</p>
            <ul className="mt-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClasses}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Connect" className="lg:col-span-2">
            <p className="text-ui text-text-primary">Connect</p>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <a href={business.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className={linkClasses}>
                  LinkedIn
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              </li>
              <li>
                <a href={business.socialLinks.github} target="_blank" rel="noopener noreferrer" className={linkClasses}>
                  GitHub
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              </li>
              <li>
                <a href={business.socialLinks.portfolio} target="_blank" rel="noopener noreferrer" className={linkClasses}>
                  Personal portfolio
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              </li>
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <p className="text-ui text-text-primary">Working together</p>
            <p className="text-ui text-text-secondary mt-4">{business.footerTrustLine}</p>
            <a
              href={business.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ui text-accent link-underline mt-4 inline-block"
            >
              Book a call
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          </div>
        </div>

        <div className="border-t border-border py-6">
          <p className="text-ui text-text-secondary">© {YEAR} DG DevWorks. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}
