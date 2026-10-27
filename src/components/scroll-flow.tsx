"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Section-to-section transition: each section tilts up out of perspective and
 * settles as it enters, then eases back as the next one takes over.
 */
export function FlowSection({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress: enter } = useScroll({ target: ref, offset: ["start end", "start 40%"] });
  const { scrollYProgress: leave } = useScroll({ target: ref, offset: ["end 45%", "end start"] });

  const rotateX = useTransform(enter, [0, 1], [10, 0]);
  const y = useTransform(enter, [0, 1], [80, 0]);
  const scale = useTransform(() => (0.93 + 0.07 * enter.get()) * (1 - 0.04 * leave.get()));
  const opacity = useTransform(() => (0.25 + 0.75 * enter.get()) * (1 - 0.45 * leave.get()));

  return (
    <div ref={ref} className={cn("overflow-x-clip [perspective:1600px]", className)}>
      <motion.div style={reduced ? undefined : { rotateX, y, scale, opacity, transformOrigin: "50% 0%" }}>
        {children}
      </motion.div>
    </div>
  );
}

const RAIL = [
  { id: "top", label: "Home" },
  { id: "about", label: "About" },
  { id: "anatomy", label: "3D anatomy" },
  { id: "treatments", label: "Treatments" },
  { id: "clinics", label: "Clinics" },
  { id: "reviews", label: "Reviews" },
  { id: "faq", label: "Questions" },
];

/**
 * Fixed side rail on wide screens. A droplet flows down it with page progress
 * and each dot jumps to its section. Smaller screens get a thin progress bar.
 */
export function FlowRail() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28 });
  const dropTop = useTransform(progress, (v) => `${v * 100}%`);
  const [active, setActive] = useState("top");

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const s of RAIL) {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  return (
    <>
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-16 z-40 h-0.5 origin-left bg-accent md:top-[72px] xl:hidden"
      />
      <nav aria-label="Page sections" className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 xl:block">
        <ul className="relative flex flex-col items-end gap-6 py-1">
          <span aria-hidden className="absolute bottom-0 right-[5px] top-0 w-px bg-line" />
          <motion.span
            aria-hidden
            style={{ top: dropTop }}
            className="absolute right-[2px] h-3 w-[7px] -translate-y-1/2 rounded-full bg-accent"
          />
          {RAIL.map((s) => {
            const on = active === s.id;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={on ? "location" : undefined}
                  className="group relative flex items-center gap-3 py-0.5"
                >
                  <span
                    className={cn(
                      "rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-ink shadow-soft transition duration-300",
                      on ? "opacity-100" : "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                    )}
                  >
                    {s.label}
                  </span>
                  <span
                    className={cn(
                      "relative size-[11px] rounded-full border transition-colors duration-300",
                      on ? "border-accent bg-accent" : "border-line bg-bg group-hover:border-accent",
                    )}
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
