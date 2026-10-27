import { ArrowDownIcon } from "@phosphor-icons/react/ssr";
import { doctor } from "@/lib/doctor";
import { BookButton } from "../booking";
import { HeroVisual } from "../hero-visual";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-16 md:pt-[72px]">
      <div className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-7xl grid-cols-1 items-center gap-2 px-4 md:min-h-[calc(100dvh-72px)] md:px-8 lg:grid-cols-12 lg:gap-8">
        <div className="relative z-10 pt-6 sm:pt-10 lg:col-span-6 lg:pt-0">
          <p className="rise text-xs font-semibold uppercase tracking-[0.16em] text-accent" style={{ "--i": 0 } as React.CSSProperties}>
            {doctor.qualifications.slice(0, 2).join(", ")}
          </p>
          <h1
            className="rise mt-4 text-[2.5rem] font-semibold leading-[1.04] tracking-tight sm:mt-5 sm:text-6xl lg:text-[4.1rem]"
            style={{ "--i": 1 } as React.CSSProperties}
          >
            {doctor.name}
            <span className="mt-2 block text-lg font-medium leading-snug tracking-normal text-muted sm:mt-3 sm:text-2xl lg:text-[1.7rem]">
              Kidney stone and prostate specialist in Lahore
            </span>
          </h1>
          <p
            className="rise mt-4 max-w-[46ch] text-[15px] leading-relaxed text-muted sm:mt-6 sm:text-lg"
            style={{ "--i": 2 } as React.CSSProperties}
          >
            Laser stone surgery, prostate care and men&apos;s health. Assistant Professor of Urology at Omar
            Hospital, Johar Town.
          </p>
          <div className="rise mt-6 flex flex-wrap items-center gap-2.5 sm:mt-8 sm:gap-3" style={{ "--i": 3 } as React.CSSProperties}>
            <BookButton className="px-5 sm:px-7 sm:py-3.5" />
            <a
              href="#treatments"
              className="group inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-semibold sm:px-6 sm:py-3.5 transition hover:border-accent hover:text-accent active:scale-[0.98]"
            >
              <span className="sm:hidden">Treatments</span>
              <span className="hidden sm:inline">See treatments</span>
              <ArrowDownIcon size={16} weight="bold" className="transition-transform group-hover:translate-y-0.5" aria-hidden />
            </a>
          </div>
        </div>

        <div className="relative -mt-2 h-[48svh] min-h-[320px] lg:col-span-6 lg:mt-0 lg:h-[min(80vh,760px)]">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
