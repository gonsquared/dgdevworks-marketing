import Link from "next/link";
import clsx from "clsx";
import { BracketMark } from "./BracketMark";

export interface LogotypeProps {
  className?: string;
}

/** BracketMark + "DevWorks" in the display face. Reused in Nav and Footer. */
export function Logotype({ className }: LogotypeProps) {
  return (
    <Link
      href="/"
      className={clsx(
        "inline-flex items-center gap-2.5 font-heading text-[1.1875rem] font-semibold tracking-[-0.02em] text-text-primary",
        className
      )}
      aria-label="DG DevWorks, home"
    >
      <BracketMark className="text-accent h-4 w-6" />
      <span>DevWorks</span>
    </Link>
  );
}
