import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/utils";

/** Outline pill linking to a fuller page. `back` slides the other way, for links into the home page. */
export function MoreLink({
  href,
  back = false,
  children,
  className,
}: {
  href: string;
  back?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      transitionTypes={[back ? "nav-back" : "nav-forward"]}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full border border-line px-6 py-3.5 text-sm font-semibold transition hover:border-accent hover:text-accent active:scale-[0.98]",
        className,
      )}
    >
      {children}
      <ArrowRightIcon size={16} weight="bold" className="transition-transform group-hover:translate-x-0.5" aria-hidden />
    </Link>
  );
}
