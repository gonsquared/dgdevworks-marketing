import Link from "next/link";
import { Logotype } from "./Logotype";
import { navLinks } from "@/lib/navLinks";
import { business } from "@/data/business";
import { Container } from "@/components/ui/Section";

const YEAR = new Date().getFullYear();

/**
 * Global footer: brand block, Site links, Connect (external, safe-linked)
 * links, and a Trust column with the repeated "Book a call" link. Rendered
 * once in the root layout so it appears on every route.
 */
export function Footer() {
  return (
    <footer id="site-footer-content" role="contentinfo" className="border-t border-rule bg-surface">
      <Container>
        <div className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logotype />
            <p className="text-body text-text-secondary mt-4 max-w-xs">{business.tagline}</p>
            <a
              href={`mailto:${business.contactEmail}`}
              className="text-ui text-accent mt-4 inline-block hover:text-accent-hover"
            >
              {business.contactEmail}
            </a>
          </div>

          <nav aria-label="Site" className="lg:col-span-2">
            <p className="font-mono-annotation text-text-secondary">{"// SITE"}</p>
            <ul className="mt-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-ui text-text-secondary hover:text-text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Connect" className="lg:col-span-2">
            <p className="font-mono-annotation text-text-secondary">{"// CONNECT"}</p>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <a
                  href={business.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ui text-text-secondary hover:text-text-primary"
                >
                  LinkedIn
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              </li>
              <li>
                <a
                  href={business.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ui text-text-secondary hover:text-text-primary"
                >
                  GitHub
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              </li>
              <li>
                <a
                  href={business.socialLinks.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ui text-text-secondary hover:text-text-primary"
                >
                  Personal portfolio ↗
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              </li>
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <p className="font-mono-annotation text-text-secondary">{"// TRUST"}</p>
            <p className="text-ui text-text-secondary mt-4">{business.footerTrustLine}</p>
            <a
              href={business.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ui text-accent mt-4 inline-block hover:text-accent-hover"
            >
              Book a call →
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          </div>
        </div>

        <div className="border-t border-rule py-6">
          <p className="font-mono-annotation text-text-secondary normal-case tracking-normal">
            © {YEAR} DG DevWorks. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
