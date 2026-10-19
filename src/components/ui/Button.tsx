import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import clsx from "clsx";

export type ButtonVariant = "solid" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-control text-ui font-medium whitespace-nowrap transition-[color,background-color,border-color,box-shadow,transform] duration-150 ease-out active:scale-[0.97] active:duration-75 motion-reduce:active:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none";

const variantClasses: Record<ButtonVariant, string> = {
  solid:
    "bg-accent text-accent-on-fill shadow-[0_1px_0_rgb(255_255_255/0.18)_inset,0_6px_16px_-6px_color-mix(in_srgb,var(--color-accent)_70%,transparent)] hover:bg-accent-hover",
  outline:
    "border border-border-strong text-text-primary hover:border-accent hover:text-accent bg-transparent",
  ghost: "text-text-primary hover:bg-wash bg-transparent",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5",
  lg: "h-[3.25rem] px-7 text-base",
};

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
}

type ButtonAsButton = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof CommonProps> & {
    href: string;
    external?: boolean;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const OWN_PROP_KEYS = ["variant", "size", "className", "children", "href", "external"] as const;

/** Strips the Button component's own props, leaving only pass-through DOM attributes. */
function omitOwnProps<T extends object>(props: T): Omit<T, (typeof OWN_PROP_KEYS)[number]> {
  const rest: Record<string, unknown> = { ...(props as Record<string, unknown>) };
  for (const key of OWN_PROP_KEYS) {
    delete rest[key];
  }
  return rest as Omit<T, (typeof OWN_PROP_KEYS)[number]>;
}

/**
 * Shared button primitive — renders a <button> or, when given `href`, a
 * next/link (internal) or plain <a> (external, with safe rel/target).
 *
 * Usage:
 *   <Button variant="solid" size="lg" href="/contact">Send a message</Button>
 *   <Button variant="outline" href={bookingUrl} external>Book a call</Button>
 *   <Button variant="ghost" onClick={...}>Cancel</Button>
 */
export function Button(props: ButtonProps) {
  const { variant = "solid", size = "md", className, children } = props;
  const classes = clsx(baseClasses, variantClasses[variant], sizeClasses[size], className);

  if ("href" in props && props.href) {
    const { href, external } = props;
    const anchorRest = omitOwnProps(props);

    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...anchorRest}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {children}
      </Link>
    );
  }

  const buttonRest = omitOwnProps(props as ButtonAsButton);
  return (
    <button className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
