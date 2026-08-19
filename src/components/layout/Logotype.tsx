import Link from "next/link";
import clsx from "clsx";
import { BracketMark } from "./BracketMark";

export interface LogotypeProps {
  className?: string;
}

/** BracketMark + "DevWorks" in Instrument Serif — reused in Nav, Footer, and root OG image. */
export function Logotype({ className }: LogotypeProps) {
  return (
    <Link
      href="/"
      className={clsx("inline-flex items-center gap-2 heading-h4 text-text-primary", className)}
      aria-label="DG DevWorks, home"
    >
      <BracketMark className="text-accent h-4 w-6" />
      <span>DevWorks</span>
    </Link>
  );
}
