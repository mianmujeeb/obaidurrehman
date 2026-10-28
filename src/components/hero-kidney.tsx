"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { useDarkTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { SceneBoundary } from "./three/scene-boundary";
import { createDragState, startDrag } from "./three/studio";
import { BrandMark } from "./brand-mark";

const HeroScene = dynamic(() => import("./three/hero-scene"), { ssr: false });

/** The interactive glass kidney, filling its parent (the hero's laser surgery card). */
export function HeroKidney() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef(createDragState());
  const inView = useInView(wrapRef, { margin: "120px" });
  const reduced = useReducedMotion() ?? false;
  const dark = useDarkTheme();
  const [ready, setReady] = useState(false);

  const poster = (
    <div className="absolute inset-0 grid place-items-center">
      <BrandMark className="size-14 opacity-25 text-accent" />
    </div>
  );

  return (
    <div className="relative h-full w-full">
      {!ready && poster}
      <div
        ref={wrapRef}
        role="img"
        aria-label="Interactive 3D model of a glass kidney with stones inside, broken up by a laser fibre passed up the ureter"
        onPointerDown={(e) => startDrag(dragRef.current, e)}
        className={cn(
          "absolute inset-0 cursor-grab touch-pan-y transition-opacity duration-1000 active:cursor-grabbing",
          ready ? "opacity-100" : "opacity-0",
        )}
      >
        <SceneBoundary fallback={poster}>
          <HeroScene
            dark={dark}
            reduced={reduced}
            active={inView}
            dragRef={dragRef}
            onReady={() => setReady(true)}
            compact
          />
        </SceneBoundary>
      </div>
    </div>
  );
}
