import type { ComponentPropsWithoutRef, ReactNode } from "react";
import clsx from "clsx";

export interface ContainerProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
}

/** Centered max-width content container with responsive gutters. */
export function Container({ children, className, ...rest }: ContainerProps) {
  return (
    <div className={clsx("mx-auto w-full max-w-[1200px] px-6 md:px-8 lg:px-10", className)} {...rest}>
      {children}
    </div>
  );
}

export interface SectionProps extends ComponentPropsWithoutRef<"section"> {
  children: ReactNode;
  /** Skip the built-in Container wrapper when the caller supplies its own. */
  bare?: boolean;
}

/** Page-level section with consistent vertical rhythm, wrapping children in a Container. */
export function Section({ children, className, bare = false, ...rest }: SectionProps) {
  return (
    <section className={clsx("py-16 md:py-20 lg:py-24", className)} {...rest}>
      {bare ? children : <Container>{children}</Container>}
    </section>
  );
}
