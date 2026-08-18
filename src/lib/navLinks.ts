export interface NavLink {
  href: string;
  label: string;
}

/** Shared nav item list — consumed by Nav, MobileNavPanel, and Footer's "Site" column. */
export const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];
