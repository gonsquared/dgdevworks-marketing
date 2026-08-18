import type { ReactNode } from "react";
import clsx from "clsx";

export interface BadgeProps {
  children: ReactNode;
  className?: string;
}

/** Small pill label — e.g. status tags, package highlights. */
export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border border-border-strong bg-surface-sunken px-2.5 py-1 text-ui text-text-secondary",
        className
      )}
    >
      {children}
    </span>
  );
}
