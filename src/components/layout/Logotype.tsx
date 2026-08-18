import Link from "next/link";
import clsx from "clsx";

export interface LogotypeProps {
  className?: string;
}

/** `[DG]` mono bracket mark + "DevWorks" in Space Grotesk — reused in Nav, Footer, and root OG image. */
export function Logotype({ className }: LogotypeProps) {
  return (
    <Link
      href="/"
      className={clsx("inline-flex items-center gap-1.5 heading-h4 text-text-primary", className)}
      aria-label="DG DevWorks, home"
    >
      <span className="font-mono-annotation text-accent normal-case tracking-normal">[DG]</span>
      <span>DevWorks</span>
    </Link>
  );
}
