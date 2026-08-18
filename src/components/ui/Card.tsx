import type { ComponentPropsWithoutRef, ReactNode } from "react";
import clsx from "clsx";

export interface CardProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  /** Adds sparing corner-bracket "registration marks" — use only on the
   * highest-signal elements (hero visual, recommended pricing tier, stat
   * callouts) per the Spec Sheet / Blueprint aesthetic. */
  bracket?: boolean;
  className?: string;
}

/**
 * Base surface card. Usage:
 *   <Card><h3>Title</h3><p>Body</p></Card>
 *   <Card bracket>Highest-signal content</Card>
 */
export function Card({ children, bracket = false, className, ...rest }: CardProps) {
  return (
    <div
      className={clsx(
        "relative rounded-lg border border-border bg-surface p-6",
        bracket && "card-bracket",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
