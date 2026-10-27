"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowUpRightIcon, CheckIcon, CubeIcon } from "@phosphor-icons/react";
import { organs, type OrganId } from "@/lib/doctor";
import { useDarkTheme } from "@/lib/theme";
import { procedureGuides } from "@/lib/treatments";
import { cn } from "@/lib/utils";
import { SceneBoundary } from "./three/scene-boundary";
import { createDragState, startDrag } from "./three/studio";

const AnatomyScene = dynamic(() => import("./three/anatomy-scene"), { ssr: false });

export function AnatomyExplorer() {
  const [selected, setSelected] = useState<OrganId>("kidney");
  const [ready, setReady] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef(createDragState());
  const nearView = useInView(wrapRef, { once: true, margin: "600px" });
  const inView = useInView(wrapRef, { margin: "80px" });
  const reduced = useReducedMotion() ?? false;
  const dark = useDarkTheme();
  const organ = organs.find((o) => o.id === selected)!;

  function onTabKey(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    const delta = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (index + delta + organs.length) % organs.length;
    setSelected(organs[next].id);
    tabsRef.current?.querySelectorAll<HTMLButtonElement>("[role=tab]")[next]?.focus();
  }

  const placeholder = (
    <div className="absolute inset-0 grid place-items-center text-muted">
      <CubeIcon size={40} weight="thin" aria-hidden />
    </div>
  );

  return (
    <div className="grid overflow-hidden rounded-3xl border border-line bg-surface shadow-soft lg:grid-cols-12">
      <div className="relative h-[54svh] max-h-[520px] min-h-[340px] lg:col-span-7 lg:h-[640px] lg:max-h-none">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_45%,var(--accent-soft),transparent)]"
        />
        {!ready && placeholder}
        <div
          ref={wrapRef}
          role="img"
          aria-label={`3D model of the urinary system with the ${organ.name.toLowerCase()} highlighted`}
          onPointerDown={(e) => startDrag(dragRef.current, e)}
          className={cn(
            "absolute inset-0 cursor-grab touch-pan-y transition-opacity duration-700 active:cursor-grabbing",
            ready ? "opacity-100" : "opacity-0",
          )}
        >
          {nearView && (
            <SceneBoundary fallback={placeholder}>
              <AnatomyScene
                selected={selected}
                onSelect={setSelected}
                dark={dark}
                reduced={reduced}
                active={inView}
                dragRef={dragRef}
                onReady={() => setReady(true)}
              />
            </SceneBoundary>
          )}
        </div>
        <p className="pointer-events-none absolute bottom-3 left-4 text-xs text-muted">
          Illustration, not to scale. Drag to turn.
        </p>
      </div>

      <div className="flex flex-col border-t border-line p-5 sm:p-8 lg:col-span-5 lg:border-l lg:border-t-0">
        <div
          ref={tabsRef}
          role="tablist"
          aria-label="Parts of the urinary system"
          className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]"
        >
          {organs.map((o, i) => {
            const active = o.id === selected;
            return (
              <button
                key={o.id}
                type="button"
                role="tab"
                id={`tab-${o.id}`}
                aria-selected={active}
                aria-controls="organ-panel"
                tabIndex={active ? 0 : -1}
                onClick={() => setSelected(o.id)}
                onKeyDown={(e) => onTabKey(e, i)}
                className={cn(
                  "relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active ? "text-accent-ink" : "text-muted hover:text-ink",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="organ-tab"
                    className="absolute inset-0 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{o.name.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>

        <div
          id="organ-panel"
          role="tabpanel"
          aria-labelledby={`tab-${selected}`}
          aria-live="polite"
          className="relative mt-6 flex-1"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={organ.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3 className="text-2xl font-semibold tracking-tight">{organ.name}</h3>
              <p className="mt-3 max-w-[60ch] leading-relaxed text-muted">{organ.summary}</p>

              <h4 className="mt-7 text-sm font-semibold">Conditions treated</h4>
              <ul className="mt-3 flex flex-wrap gap-2">
                {organ.conditions.map((c) => (
                  <li key={c} className="rounded-full bg-accent-soft px-3 py-1.5 text-sm text-ink">
                    {c}
                  </li>
                ))}
              </ul>

              <h4 className="mt-7 text-sm font-semibold">Procedures</h4>
              <ul className="mt-3 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                {organ.procedures.map((p) => {
                  const guide = procedureGuides[p];
                  return (
                    <li key={p} className="flex items-start gap-2 text-sm">
                      <CheckIcon size={16} weight="bold" className="mt-0.5 shrink-0 text-accent" aria-hidden />
                      {guide ? (
                        <Link
                          href={`/treatments/${guide}`}
                          transitionTypes={["nav-forward"]}
                          className="group inline-flex items-start gap-1 font-medium text-accent underline-offset-4 hover:underline"
                        >
                          {p}
                          <ArrowUpRightIcon
                            size={14}
                            weight="bold"
                            className="mt-0.5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            aria-hidden
                          />
                        </Link>
                      ) : (
                        p
                      )}
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
