import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { allServices } from "@/lib/doctor";
import { treatments, type SceneKind } from "@/lib/treatments";
import { cn } from "@/lib/utils";
import { Reveal, TiltCard } from "../motion";
import { TreatmentArt } from "../treatment-art";
import { TreatmentIcon } from "../treatment-icon";

// 12-col bento on desktop, 2-col on tablets. Exactly six cells, no gaps.
const LAYOUT: Record<SceneKind, { span: string; surface: string }> = {
  laser: {
    span: "md:col-span-2 lg:col-span-7 lg:row-span-2",
    surface: "border-transparent bg-accent text-accent-ink [--spot:rgb(255_255_255/0.2)]",
  },
  pcnl: { span: "lg:col-span-5", surface: "bg-surface" },
  eswl: { span: "lg:col-span-5", surface: "bg-accent-soft" },
  turp: { span: "lg:col-span-4", surface: "bg-surface" },
  lap: { span: "lg:col-span-4", surface: "bg-surface-2" },
  varicocele: { span: "md:col-span-2 lg:col-span-4", surface: "bg-surface" },
};

export function Treatments() {
  return (
    <section id="treatments" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <Reveal className="max-w-3xl">
          <h2 className="text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
            Less invasive options for stones, prostate and kidney surgery.
          </h2>
          <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-muted">
            Many procedures are done through a scope or a keyhole, which usually means less pain and a
            quicker return home. Open any treatment to see how it works, step by step in 3D.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:auto-rows-[minmax(220px,auto)] lg:grid-cols-12">
          {treatments.map((t, i) => {
            const feature = t.scene === "laser";
            return (
              <Reveal key={t.slug} delay={i * 0.05} className={LAYOUT[t.scene].span}>
                <Link
                  href={`/treatments/${t.slug}`}
                  transitionTypes={["nav-forward"]}
                  className="block h-full rounded-3xl"
                >
                  <TiltCard
                    max={feature ? 4 : 6}
                    className={cn(
                      "flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-line p-7",
                      LAYOUT[t.scene].surface,
                      feature && "min-h-[320px] sm:p-10",
                    )}
                  >
                    {feature && (
                      <div
                        aria-hidden
                        className="absolute inset-0 bg-[radial-gradient(80%_60%_at_85%_10%,rgb(255_255_255/0.18),transparent_60%),repeating-radial-gradient(circle_at_85%_10%,rgb(255_255_255/0.07)_0_1px,transparent_1px_22px)]"
                      />
                    )}
                    <div className="relative flex items-start justify-between gap-4">
                      <ViewTransition name={`icon-${t.slug}`} share="morph" default="none">
                        <span
                          className={cn(
                            "grid size-12 shrink-0 place-items-center rounded-full",
                            feature ? "bg-accent-ink/15" : "bg-accent-soft text-accent",
                          )}
                        >
                          <TreatmentIcon kind={t.scene} size={24} />
                        </span>
                      </ViewTransition>
                      {!feature && (
                        <TreatmentArt kind={t.scene} className="-mr-3 -mt-3 h-32 w-52 text-accent sm:h-36 sm:w-60 lg:h-40 lg:w-64" />
                      )}
                    </div>
                    {/* The featured card plays on its own while on screen. */}
                    {feature && (
                      <TreatmentArt
                        kind={t.scene}
                        autoplay
                        className="relative my-4 h-48 sm:h-60 lg:h-auto lg:min-h-52 lg:flex-1"
                      />
                    )}
                    <div className={cn("relative", feature ? "mt-2" : "mt-6")}>
                      <ViewTransition name={`title-${t.slug}`} share="morph" default="none">
                        <h3
                          className={cn(
                            "w-fit font-semibold tracking-tight",
                            feature ? "text-3xl md:text-4xl" : "text-xl",
                          )}
                        >
                          {t.name}
                        </h3>
                      </ViewTransition>
                      <p
                        className={cn(
                          "mt-3 max-w-[48ch] leading-relaxed",
                          feature ? "text-lg opacity-90" : "text-muted",
                        )}
                      >
                        {t.short}
                      </p>
                      <span
                        className={cn(
                          "mt-5 inline-flex items-center gap-1.5 text-sm font-semibold",
                          feature ? "text-accent-ink" : "text-accent",
                        )}
                      >
                        See how it works
                        <ArrowRightIcon
                          size={16}
                          weight="bold"
                          className="transition-transform duration-300 group-hover:translate-x-1"
                          aria-hidden
                        />
                      </span>
                    </div>
                  </TiltCard>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>

      <div className="mt-16 overflow-hidden border-y border-line py-5">
        <h3 className="sr-only">All services</h3>
        <ul className="sr-only">
          {allServices.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <div aria-hidden className="marquee-track flex w-max animate-marquee gap-3">
          {[...allServices, ...allServices].map((s, i) => (
            <span key={i} className="shrink-0 rounded-full border border-line px-4 py-2 text-sm text-muted">
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
