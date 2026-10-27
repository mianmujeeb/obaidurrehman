import { ViewTransition, type ReactNode } from "react";
import { MobileActionBar } from "./mobile-action-bar";
import { SiteFooter } from "./sections/closing";
import { SiteHeader, type SiteArea } from "./site-header";
import { cn } from "@/lib/utils";

const slide = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  default: "none",
};

/** Header, sliding page body, footer and the phone action bar shared by inner pages. */
export function PageFrame({ current, children }: { current: SiteArea; children: ReactNode }) {
  return (
    <>
      <SiteHeader current={current} />
      <ViewTransition enter={slide} exit={slide} default="none">
        <main id="main">{children}</main>
      </ViewTransition>
      <SiteFooter />
      <MobileActionBar />
    </>
  );
}

/** Left-aligned page opener with an optional panel on the right from lg. */
export function PageHero({
  title,
  lead,
  children,
  aside,
}: {
  title: ReactNode;
  lead: ReactNode;
  children?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 pt-28 md:px-8 md:pb-14 md:pt-36">
      <div className={cn("grid gap-10", aside != null && "lg:grid-cols-12 lg:items-end")}>
        <div className={cn(aside != null && "lg:col-span-7")}>
          <h1 className="rise max-w-[18ch] text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="rise mt-6 max-w-[58ch] text-lg leading-relaxed text-muted" style={{ "--i": 1 } as React.CSSProperties}>
            {lead}
          </p>
          {children && (
            <div className="rise mt-8" style={{ "--i": 2 } as React.CSSProperties}>
              {children}
            </div>
          )}
        </div>
        {aside && (
          <div className="rise lg:col-span-5" style={{ "--i": 3 } as React.CSSProperties}>
            {aside}
          </div>
        )}
      </div>
    </section>
  );
}
