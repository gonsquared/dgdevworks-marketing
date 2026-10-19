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
        "inline-flex items-center rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-accent",
        className
      )}
    >
      {children}
    </span>
  );
}
