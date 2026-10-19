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
      className="group text-ui text-text-secondary mb-10 inline-flex items-center gap-2 py-2 transition-colors duration-150 [@media(hover:hover)_and_(pointer:fine)]:hover:text-text-primary"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="size-4 transition-transform duration-200 ease-out [@media(hover:hover)_and_(pointer:fine)]:group-hover:-translate-x-0.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 3.5 5.5 8l4.5 4.5" />
      </svg>
      {label}
    </Link>
  );
}
