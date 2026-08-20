import Link from "next/link";

export interface BackLinkProps {
  href: string;
  label: string;
}

/** Breadcrumb-style back link for detail pages nested under an index page. */
export function BackLink({ href, label }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="group font-mono-annotation text-text-secondary hover:text-accent focus-visible:text-accent mb-8 inline-flex items-center gap-2 transition-colors duration-150"
    >
      <span
        aria-hidden="true"
        className="transition-transform duration-150 group-hover:-translate-x-1 group-focus-visible:-translate-x-1"
      >
        ←
      </span>
      {label}
    </Link>
  );
}
