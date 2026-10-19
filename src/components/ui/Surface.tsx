import type { ComponentPropsWithoutRef, ReactNode } from "react";
import clsx from "clsx";

export type SurfaceVariant = "plain" | "panel" | "inverted";

export interface SurfaceProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  /** "plain" (default) — no box, just a positioning context.
   *  "panel" — raised, rounded, padded surface for genuinely enclosed content
   *  (contact form, featured case study, recommended price).
   *  "inverted" — sunken-background panel, for quiet secondary content. */
  variant?: SurfaceVariant;
  /** Adds a hover lift for surfaces that act as the primary interactive
   * element in their row/card (pointer-fine devices only). */
  interactive?: boolean;
  className?: string;
}

const variantClasses: Record<SurfaceVariant, string> = {
  plain: "",
  panel: "rounded-panel border border-border bg-surface p-6 shadow-panel md:p-8",
  inverted: "rounded-panel bg-surface-sunken p-6 md:p-8",
};

/**
 * Base surface primitive. Usage:
 *   <Surface variant="panel">Enclosed content</Surface>
 *   <Surface variant="inverted">Quiet secondary content</Surface>
 */
export function Surface({ children, variant = "plain", interactive = false, className, ...rest }: SurfaceProps) {
  return (
    <div
      className={clsx(
        "relative",
        variantClasses[variant],
        interactive &&
          "transition-[box-shadow,transform] duration-300 ease-out motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-0.5 [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-lift",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
