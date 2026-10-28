"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import type { SceneKind } from "@/lib/treatments";
import { cn } from "@/lib/utils";
import { TreatmentArt } from "./treatment-art";

export type RailItem = {
  slug: string;
  scene: SceneKind;
  name: string;
  short: string;
  facts: { label: string; value: string }[];
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Pinned horizontal rail, like the "How it works" stage: the section holds
 * still while scrolling down slides the cards sideways, one pixel for one.
 * Falls back to a plain swipeable row until it has measured itself.
 */
export function TreatmentRail({ items }: { items: RailItem[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const [distance, setDistance] = useState(0);
  const [active, setActive] = useState(0);
  const pinned = distance > 0;

  const travel = useMotionValue(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(() => -scrollYProgress.get() * travel.get());

  useMotionValueEvent(scrollYProgress, "change", (p) => setActive(Math.round(p * (items.length - 1))));

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    const measure = () => {
      // Content width, not clientWidth: the swipeable fallback pads the row edge to edge.
      const cs = getComputedStyle(viewport);
      const inner = viewport.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      // Too short a screen to hold the heading and a card: keep the swipeable row.
      const fits = window.innerHeight >= 660;
      const d = fits ? Math.max(0, Math.round(track.offsetWidth - inner)) : 0;
      travel.set(d);
      setDistance(d);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(viewport);
    ro.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [travel]);

  /** Scrolls the page to where card `i` is the current one. */
  function goTo(i: number) {
    const section = sectionRef.current;
    if (!section || !pinned) return;
    const range = section.offsetHeight - window.innerHeight;
    const top = section.getBoundingClientRect().top + window.scrollY + (range * i) / Math.max(1, items.length - 1);
    // CSS scroll-behavior already turns smooth scrolling off for reduced motion.
    window.scrollTo({ top, behavior: "smooth" });
  }

  return (
    <section
      ref={sectionRef}
      aria-labelledby="other-treatments"
      style={pinned ? { height: `calc(100svh + ${distance}px)` } : undefined}
      className="relative"
    >
      <div
        className={cn(
          pinned
            ? // Phones keep clear of the Call / Book bar fixed along the bottom.
              "sticky top-0 flex h-svh flex-col justify-center overflow-x-clip pb-[calc(env(safe-area-inset-bottom)+5rem)] pt-16 md:pb-8 md:pt-[72px]"
            : "py-20 md:py-28",
        )}
      >
        <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
          <h2 id="other-treatments" className="text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
            Other treatments
          </h2>
          <p className="mt-3 hidden max-w-[48ch] leading-relaxed text-muted sm:block">
            Each one has its own step-by-step guide with a 3D walkthrough.
          </p>

          <div
            ref={viewportRef}
            className={cn(
              "mt-6 md:mt-10",
              !pinned && "-mx-4 snap-x snap-mandatory overflow-x-auto px-4 [scrollbar-width:none] md:-mx-8 md:px-8",
            )}
          >
            <motion.ul ref={trackRef} style={pinned ? { x } : undefined} className="flex w-max gap-4 md:gap-6">
              {items.map((o, i) => (
                <li
                  key={o.slug}
                  className="w-[min(82vw,24rem)] shrink-0 snap-start lg:w-[26rem]"
                  onFocus={(e) => {
                    // Keyboard users tabbing along the rail: bring the card into view.
                    if ((e.target as HTMLElement).matches(":focus-visible")) goTo(i);
                  }}
                >
                  <Card item={o} index={i} live={pinned && i === active} />
                </li>
              ))}
            </motion.ul>
          </div>

          {pinned && (
            // Controls on the left so they never sit under the back-to-top button.
            <div className="mt-6 flex items-center gap-2 md:mt-8">
              <RailButton label="Previous treatment" disabled={active === 0} onClick={() => goTo(active - 1)}>
                <ArrowLeftIcon size={16} weight="bold" aria-hidden />
              </RailButton>
              <RailButton label="Next treatment" disabled={active === items.length - 1} onClick={() => goTo(active + 1)}>
                <ArrowRightIcon size={16} weight="bold" aria-hidden />
              </RailButton>
              <p className="mx-2 text-sm tabular-nums text-muted" aria-live="polite">
                <span className="font-semibold text-ink">{pad(active + 1)}</span> / {pad(items.length)}
              </p>
              <div aria-hidden className="h-1 flex-1 overflow-hidden rounded-full bg-line">
                <motion.div style={{ scaleX: scrollYProgress }} className="h-full origin-left rounded-full bg-accent" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Card({ item, index, live }: { item: RailItem; index: number; live: boolean }) {
  return (
    <Link
      href={`/treatments/${item.slug}`}
      transitionTypes={["nav-forward"]}
      className="group flex h-full flex-col rounded-3xl border border-line bg-surface p-5 transition-colors duration-300 hover:border-accent sm:p-7"
    >
      {/* Illustration plate: plays for the current card, and on hover or focus. */}
      <span className="relative block h-24 overflow-hidden rounded-2xl bg-accent-soft/60 text-accent sm:h-36 lg:h-40">
        <TreatmentArt kind={item.scene} live={live} className="absolute inset-x-4 inset-y-2" />
        <span className="absolute right-4 top-3 text-sm font-medium tabular-nums text-muted">{pad(index + 1)}</span>
      </span>
      <h3 className="mt-4 text-xl font-semibold tracking-tight sm:mt-6 sm:text-2xl">{item.name}</h3>
      <p className="mb-4 mt-2 line-clamp-2 leading-relaxed text-muted sm:mb-5 sm:mt-3 sm:line-clamp-3">{item.short}</p>
      <dl className="mt-auto grid grid-cols-2 gap-4 border-t border-line pt-5 text-sm">
        {item.facts.map((f) => (
          <div key={f.label}>
            <dt className="text-muted">{f.label}</dt>
            <dd className="mt-1 font-medium leading-snug">{f.value}</dd>
          </div>
        ))}
      </dl>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent sm:mt-5">
        See how it works
        <ArrowRightIcon
          size={16}
          weight="bold"
          className="transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden
        />
      </span>
    </Link>
  );
}

function RailButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-11 place-items-center rounded-full border border-line transition hover:border-accent hover:text-accent active:scale-[0.96] disabled:pointer-events-none disabled:opacity-35"
    >
      {children}
    </button>
  );
}
