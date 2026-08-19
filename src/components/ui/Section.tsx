import type { ComponentPropsWithoutRef, ReactNode } from "react";
import clsx from "clsx";

export interface ContainerProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
}

/** Centered max-width content container with responsive gutters. */
export function Container({ children, className, ...rest }: ContainerProps) {
  return (
    <div className={clsx("mx-auto w-full max-w-[1280px] px-6 md:px-8 lg:px-10", className)} {...rest}>
      {children}
    </div>
  );
}

export type SectionSize = "tight" | "default" | "loose";
export type SectionRule = "top" | "bottom" | "both" | "none";

const sizeClasses: Record<SectionSize, string> = {
  tight: "py-12 md:py-16",
  default: "py-20 md:py-24 lg:py-28",
  loose: "py-28 md:py-32 lg:py-40",
};

export interface SectionProps extends ComponentPropsWithoutRef<"section"> {
  children: ReactNode;
  /** Skip the built-in Container wrapper when the caller supplies its own. */
  bare?: boolean;
  /** Vertical rhythm gear. Defaults to "default". */
  size?: SectionSize;
  /** Full-bleed hairline rule(s) at the section boundary. Defaults to "none". */
  rule?: SectionRule;
  /** Background/content spans the full viewport width while the content itself
   * stays inset to the container width — for full-bleed bands. */
  bleed?: boolean;
}

/** Page-level section with editorial vertical rhythm and optional full-bleed rules/bands. */
export function Section({
  children,
  className,
  bare = false,
  size = "default",
  rule = "none",
  bleed = false,
  ...rest
}: SectionProps) {
  const ruleClasses = clsx(
    (rule === "top" || rule === "both") && "border-t border-rule",
    (rule === "bottom" || rule === "both") && "border-b border-rule"
  );

  if (bleed) {
    return (
      <section
        className={clsx(sizeClasses[size], ruleClasses, "grid grid-cols-[1fr_min(1280px,100%)_1fr]", className)}
        {...rest}
      >
        <div className="col-start-2 col-end-3 w-full px-6 md:px-8 lg:px-10">{children}</div>
      </section>
    );
  }

  return (
    <section className={clsx(sizeClasses[size], ruleClasses, className)} {...rest}>
      {bare ? children : <Container>{children}</Container>}
    </section>
  );
}
