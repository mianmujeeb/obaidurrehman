"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

/** Fades and lifts content in once as it enters the viewport. */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li";
}) {
  const Tag = as === "li" ? motion.li : motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay, ease }}
    >
      {children}
    </Tag>
  );
}

/**
 * Card that tilts toward a mouse pointer in 3D and lights its surface under the
 * cursor. Touch and reduced-motion users get a static card.
 */
export function TiltCard({
  children,
  className,
  max = 7,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const rotateX = useSpring(rx, { stiffness: 160, damping: 18 });
  const rotateY = useSpring(ry, { stiffness: 160, damping: 18 });
  const spotlight = useMotionTemplate`radial-gradient(380px circle at ${mx}% ${my}%, var(--spot, rgb(255 255 255 / 0.14)), transparent 65%)`;

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduced || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * max * 2);
    rx.set(-(py - 0.5) * max * 2);
    mx.set(px * 100);
    my.set(py * 100);
  }

  function onLeave() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className={cn("group relative [transform-style:preserve-3d]", className)}
    >
      <motion.div
        aria-hidden
        style={{ background: spotlight }}
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      {children}
    </motion.div>
  );
}

/** Counts up to `to` when scrolled into view. Server HTML holds the final value. */
export function CountUp({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();
  const final = `${to.toFixed(decimals)}${suffix}`;

  useEffect(() => {
    const node = ref.current;
    if (!inView || !node || reduced) return;
    const controls = animate(0, to, {
      duration: 1.8,
      ease,
      onUpdate: (v) => {
        node.textContent = `${v.toFixed(decimals)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduced, to, decimals, suffix]);

  return (
    <span ref={ref} className="tabular-nums">
      {final}
    </span>
  );
}

/** Vertical timeline whose spine draws itself as the reader scrolls. */
export function Timeline({ items }: { items: { period: string; title: string; place: string }[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <ol ref={ref} className="relative space-y-8 pl-8">
      <span aria-hidden className="absolute bottom-2 left-[7px] top-2 w-px bg-line" />
      <motion.span
        aria-hidden
        style={{ scaleY }}
        className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-accent"
      />
      {items.map((item, i) => (
        <motion.li
          key={item.title}
          className="relative"
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: i * 0.05, ease }}
        >
          <span
            aria-hidden
            className="absolute -left-8 top-1.5 grid size-[15px] place-items-center rounded-full border border-accent bg-bg"
          >
            <span className="size-[7px] rounded-full bg-accent" />
          </span>
          <p className="text-sm font-medium text-accent">{item.period}</p>
          <p className="mt-1 text-lg font-semibold leading-snug">{item.title}</p>
          <p className="mt-0.5 text-muted">{item.place}</p>
        </motion.li>
      ))}
    </ol>
  );
}
