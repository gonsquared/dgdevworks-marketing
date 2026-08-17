import clsx from "clsx";

export interface TrustLineProps {
  children: string;
  className?: string;
}

/** Visible-without-interaction trust/data-use line. Reused with different copy in footer vs. contact page. */
export function TrustLine({ children, className }: TrustLineProps) {
  return <p className={clsx("text-ui text-text-secondary", className)}>{children}</p>;
}
