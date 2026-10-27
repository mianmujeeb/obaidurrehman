"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useSpring } from "motion/react";
import type { Treatment } from "@/lib/treatments";
import { useDarkTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { SceneBoundary } from "./three/scene-boundary";
import { BrandMark } from "./brand-mark";

const ProcedureScene = dynamic(() => import("./three/procedure-scene"), { ssr: false });

/**
 * Scroll-driven procedure walkthrough. The 3D scene stays pinned while the
 * steps scroll past; whichever step crosses the reading line drives the scene.
 */
export function ProcedureFlow({ treatment }: { treatment: Treatment }) {
  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { margin: "80px" });
  const reduced = useReducedMotion() ?? false;
  const dark = useDarkTheme();

  function goTo(i: number) {
    document.getElementById(`step-${i}`)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
  }

  const poster = (
    <div className="absolute inset-0 grid place-items-center">
      <BrandMark className="size-28 text-accent opacity-20" />
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
      {/* Phones pin the stage under the header so the steps scroll beneath it.
          From lg it is centred in the viewport below the 72px header. */}
      <div className="sticky top-16 z-10 -mx-4 self-start bg-bg px-4 pb-3 pt-2 md:top-[72px] md:-mx-8 md:px-8 lg:col-span-6 lg:mx-0 lg:bg-transparent lg:p-0 lg:[--stage-h:min(100dvh_-_8rem,_760px)] lg:top-[calc(72px_+_(100dvh_-_72px_-_var(--stage-h))_/_2)]">
        <div
          ref={stageRef}
          className="relative h-[42svh] min-h-[280px] overflow-hidden rounded-3xl border border-line bg-surface shadow-soft lg:h-(--stage-h)"
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_45%,var(--accent-soft),transparent)]"
          />
          {!ready && poster}
          <div
            role="img"
            aria-label={`Animated 3D illustration of ${treatment.name}: ${treatment.steps[step].title}`}
            className={cn("absolute inset-0 transition-opacity duration-700", ready ? "opacity-100" : "opacity-0")}
          >
            <SceneBoundary fallback={poster}>
              <ProcedureScene
                kind={treatment.scene}
                step={step}
                dark={dark}
                reduced={reduced}
                active={inView}
                onReady={() => setReady(true)}
              />
            </SceneBoundary>
          </div>

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-surface via-surface/85 to-transparent p-4 pt-10 sm:p-5 sm:pt-12">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={step}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="mb-3 text-sm font-semibold"
              >
                {treatment.steps[step].title}
              </motion.p>
            </AnimatePresence>
            <div className="flex gap-1.5" role="group" aria-label="Procedure stages">
              {treatment.steps.map((s, i) => (
                <button
                  key={s.title}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={s.title}
                  aria-current={i === step ? "step" : undefined}
                  className="group relative h-6 flex-1"
                >
                  <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-line">
                    <motion.span
                      className="block h-full origin-left rounded-full bg-accent"
                      initial={false}
                      animate={{ scaleX: i <= step ? 1 : 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ol className="lg:col-span-6">
        {treatment.steps.map((s, i) => (
          <motion.li
            key={s.title}
            id={`step-${i}`}
            onViewportEnter={() => setStep(i)}
            viewport={{ margin: "-55% 0px -40% 0px" }}
            className="flex min-h-[52svh] flex-col justify-center py-8 lg:min-h-[72vh]"
          >
            <div
              className={cn(
                "transition-[opacity,transform] duration-500",
                i === step ? "opacity-100" : "opacity-35 lg:translate-x-2",
              )}
            >
              <span
                className={cn(
                  "grid size-10 place-items-center rounded-full border text-sm font-semibold transition-colors duration-500",
                  i === step ? "border-accent bg-accent text-accent-ink" : "border-line text-muted",
                )}
                aria-hidden
              >
                {i + 1}
              </span>
              <h3 className="mt-5 text-2xl font-semibold tracking-tight md:text-4xl">{s.title}</h3>
              <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-muted">{s.body}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

/** Recovery milestones joined by a line that draws as the reader scrolls. */
export function RecoveryFlow({ items }: { items: Treatment["recovery"] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <ol ref={ref} className="relative grid gap-10 pl-8 lg:grid-cols-4 lg:gap-6 lg:pl-0 lg:pt-10">
      <span aria-hidden className="absolute bottom-2 left-[7px] top-2 w-px bg-line lg:hidden" />
      <motion.span
        aria-hidden
        style={{ scaleY: progress }}
        className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-accent lg:hidden"
      />
      <span aria-hidden className="absolute inset-x-0 top-[7px] hidden h-px bg-line lg:block" />
      <motion.span
        aria-hidden
        style={{ scaleX: progress }}
        className="absolute inset-x-0 top-[7px] hidden h-px origin-left bg-accent lg:block"
      />
      {items.map((item, i) => (
        <motion.li
          key={item.when}
          className="relative"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          <span
            aria-hidden
            className="absolute -left-8 top-1 grid size-[15px] place-items-center rounded-full border border-accent bg-bg lg:-top-10 lg:left-0"
          >
            <span className="size-[7px] rounded-full bg-accent" />
          </span>
          <p className="text-sm font-semibold text-accent">{item.when}</p>
          <p className="mt-2 max-w-[34ch] leading-relaxed">{item.what}</p>
        </motion.li>
      ))}
    </ol>
  );
}
