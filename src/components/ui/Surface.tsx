import type { ComponentPropsWithoutRef, ReactNode } from "react";
import clsx from "clsx";

export type SurfaceVariant = "plain" | "panel" | "inverted";

export interface SurfaceProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  /** "plain" (default) — a bare hairline top rule, no border box.
   *  "panel" — bordered, rounded, padded box, for genuinely enclosed content
   *  (contact form, FAQ, modal).
   *  "inverted" — sunken-background panel, for the closing band. */
  variant?: SurfaceVariant;
  /** Adds hover/focus-visible affordances (background wash) for surfaces that
   * act as or contain the primary interactive element in their row/card. */
  interactive?: boolean;
  className?: string;
}

const variantClasses: Record<SurfaceVariant, string> = {
  plain: "border-t border-rule",
  panel: "rounded-[3px] border border-rule bg-surface p-6",
  inverted: "rounded-[3px] bg-surface-sunken p-6",
};

/**
 * Base surface primitive — replaces Card. Usage:
 *   <Surface><h3>Title</h3><p>Body</p></Surface>
 *   <Surface variant="panel">Enclosed content</Surface>
 *   <Surface variant="inverted">Closing band content</Surface>
 */
export function Surface({ children, variant = "plain", interactive = false, className, ...rest }: SurfaceProps) {
  return (
    <div
      className={clsx(
        "relative",
        variantClasses[variant],
        interactive && "transition-colors duration-150 hover:bg-wash focus-within:bg-wash",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
