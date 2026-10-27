"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowUpIcon } from "@phosphor-icons/react";

/**
 * Floating "back to top" button with a ring that fills as the page is read.
 * Shown after about a screen and a half; sits above the phone action bar.
 */
export function BackToTop() {
  const { scrollY, scrollYProgress } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setShow(y > window.innerHeight * 1.5));

  function toTop(e: React.MouseEvent) {
    // CSS scroll-behavior already turns smooth scrolling off for reduced motion.
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Keyboard activation (no pointer): move focus to the top too, so the next Tab starts there.
    if (e.detail === 0) document.querySelector<HTMLElement>("header a")?.focus({ preventScroll: true });
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          aria-label="Back to top"
          onClick={toTop}
          initial={{ opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 12 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className="group fixed bottom-[calc(env(safe-area-inset-bottom)+5.25rem)] right-4 z-30 grid size-12 place-items-center rounded-full border border-line bg-surface text-ink shadow-soft transition-colors hover:border-accent hover:text-accent md:bottom-6 md:right-6"
        >
          <svg aria-hidden viewBox="0 0 48 48" className="absolute inset-0 size-full -rotate-90">
            <motion.circle
              cx="24"
              cy="24"
              r="22.5"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              className="stroke-accent"
              style={{ pathLength: scrollYProgress }}
            />
          </svg>
          <ArrowUpIcon size={18} weight="bold" aria-hidden className="transition-transform group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
