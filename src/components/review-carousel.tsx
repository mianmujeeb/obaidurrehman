"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { motion, useScroll } from "motion/react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  QuotesIcon,
  StarIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  XIcon,
} from "@phosphor-icons/react";
import { reviewSourceName as SOURCE_NAME, type Review } from "@/lib/doctor";
import { cn } from "@/lib/utils";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Swipeable review carousel: a native scroll-snap track (touch, trackpad and
 * arrow keys all work) with previous/next buttons, a counter and a progress
 * bar. No autoplay. Long reviews are clamped and open in full in a dialog.
 */
export function ReviewCarousel({ reviews }: { reviews: Review[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState(0);
  const [edge, setEdge] = useState({ start: true, end: false });
  const [full, setFull] = useState<Review | null>(null);
  const { scrollXProgress } = useScroll({ container: trackRef });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const slides = [...track.children] as HTMLElement[];
        const origin = slides[0]?.offsetLeft ?? 0;
        const end = track.scrollLeft >= track.scrollWidth - track.clientWidth - 8;
        let nearest = 0;
        slides.forEach((s, i) => {
          if (Math.abs(s.offsetLeft - origin - track.scrollLeft) < Math.abs(slides[nearest].offsetLeft - origin - track.scrollLeft)) nearest = i;
        });
        setActive(end ? slides.length - 1 : nearest);
        setEdge({ start: track.scrollLeft < 8, end });
      });
    };
    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  function step(dir: 1 | -1) {
    const track = trackRef.current;
    const first = track?.children[0] as HTMLElement | undefined;
    if (!track || !first) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({ left: dir * (first.offsetWidth + gap), behavior: smooth ? "smooth" : "auto" });
  }

  function expand(r: Review) {
    flushSync(() => setFull(r));
    dialogRef.current?.showModal();
  }

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Patient reviews">
      <ul
        ref={trackRef}
        id="reviews-track"
        tabIndex={0}
        aria-label="Reviews, scroll sideways for more"
        className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:-mx-8 md:scroll-px-8 md:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {reviews.map((r, i) => (
          <li
            key={`${r.source}-${r.name}-${i}`}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${reviews.length}`}
            className="w-[85%] shrink-0 snap-start sm:w-[60%] md:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]"
          >
            <article className="flex h-full flex-col rounded-3xl border border-line bg-bg p-6 sm:p-8">
              <ReviewHeader review={r} />
              <QuotesIcon size={24} weight="fill" className="mt-6 text-accent" aria-hidden />
              <ClampedQuote review={r} onExpand={() => expand(r)} />
              <ReviewAuthor review={r} />
            </article>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center gap-2">
        <CarouselButton label="Previous review" disabled={edge.start} onClick={() => step(-1)}>
          <ArrowLeftIcon size={16} weight="bold" aria-hidden />
        </CarouselButton>
        <CarouselButton label="Next review" disabled={edge.end} onClick={() => step(1)}>
          <ArrowRightIcon size={16} weight="bold" aria-hidden />
        </CarouselButton>
        <p className="mx-2 text-sm tabular-nums text-muted" aria-live="polite">
          <span className="font-semibold text-ink">{pad(active + 1)}</span> / {pad(reviews.length)}
        </p>
        <div aria-hidden className="h-1 flex-1 overflow-hidden rounded-full bg-line">
          <motion.div style={{ scaleX: scrollXProgress }} className="h-full origin-left rounded-full bg-accent" />
        </div>
      </div>

      <dialog
        ref={dialogRef}
        aria-label={full ? `Review by ${full.name}` : "Review"}
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
        className="sheet-dialog text-ink"
      >
        {full && (
          <div className="max-h-[88dvh] overflow-y-auto p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <ReviewHeader review={full} />
              </div>
              <form method="dialog">
                <button
                  aria-label="Close"
                  className="-m-1 rounded-full p-2 text-muted transition hover:bg-surface-2 hover:text-ink"
                >
                  <XIcon size={20} aria-hidden />
                </button>
              </form>
            </div>
            <QuotesIcon size={24} weight="fill" className="mt-6 text-accent" aria-hidden />
            <blockquote className="mt-3 whitespace-pre-line text-lg font-medium leading-relaxed tracking-tight">
              {full.text}
            </blockquote>
            <ReviewAuthor review={full} />
          </div>
        )}
      </dialog>
    </div>
  );
}

function ReviewHeader({ review: r }: { review: Review }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="inline-flex items-center gap-2 rounded-full border border-line py-1 pl-1 pr-3 text-xs font-semibold">
        <span aria-hidden className="grid size-5 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-ink">
          {SOURCE_NAME[r.source][0]}
        </span>
        {SOURCE_NAME[r.source]}
      </span>
      <Verdict review={r} />
    </div>
  );
}

/** The review text cut to a few lines, with a button to read the rest when it overflows. */
function ClampedQuote({ review: r, onExpand }: { review: Review; onExpand: () => void }) {
  const ref = useRef<HTMLQuoteElement>(null);
  const [clamped, setClamped] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setClamped(el.scrollHeight > el.clientHeight + 1));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="mt-3 flex-1">
      <blockquote
        ref={ref}
        className="line-clamp-8 whitespace-pre-line text-lg font-medium leading-snug tracking-tight sm:line-clamp-6 sm:text-xl"
      >
        {r.text}
      </blockquote>
      {clamped && (
        <button
          type="button"
          onClick={onExpand}
          className="mt-3 text-sm font-semibold text-accent underline-offset-4 hover:underline"
        >
          Read full review<span className="sr-only"> by {r.name}</span>
        </button>
      )}
    </div>
  );
}

function ReviewAuthor({ review: r }: { review: Review }) {
  const initials =
    r.name
      .split(/[\s.]+/)
      .filter((w) => /^\p{L}/u.test(w) && !/^dr$/i.test(w))
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("") || r.name[0];

  return (
    <div className="mt-6 flex items-center gap-3 border-t border-line pt-5 text-sm">
      <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-accent-soft font-semibold text-accent">
        {initials}
      </span>
      <div className="min-w-0">
        {r.link ? (
          <a href={r.link} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">
            {r.name}
          </a>
        ) : (
          <p className="font-semibold">{r.name}</p>
        )}
        <p className="text-muted">
          {r.source === "google" ? "Google review" : "Verified patient"}
          {r.translated && <> · Translated by Google</>}
          {r.date && <> · {r.date}</>}
        </p>
      </div>
    </div>
  );
}

function Verdict({ review: r }: { review: Review }) {
  if (r.rating) {
    return (
      <span className="flex gap-0.5 text-accent" role="img" aria-label={`Rated ${r.rating} out of 5`}>
        {Array.from({ length: 5 }, (_, i) => (
          <StarIcon key={i} size={16} weight={i < Math.round(r.rating!) ? "fill" : "regular"} aria-hidden />
        ))}
      </span>
    );
  }
  if (r.recommends === undefined) return null;
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", r.recommends ? "text-accent" : "text-muted")}>
      {r.recommends ? (
        <ThumbsUpIcon size={16} weight="fill" aria-hidden />
      ) : (
        <ThumbsDownIcon size={16} weight="fill" aria-hidden />
      )}
      {r.recommends ? "Recommends the doctor" : "Does not recommend"}
    </span>
  );
}

function CarouselButton({
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
      aria-controls="reviews-track"
      disabled={disabled}
      onClick={onClick}
      className="grid size-11 place-items-center rounded-full border border-line bg-bg transition hover:border-accent hover:text-accent active:scale-[0.96] disabled:pointer-events-none disabled:opacity-35"
    >
      {children}
    </button>
  );
}
