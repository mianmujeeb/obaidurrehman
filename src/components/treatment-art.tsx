"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useInView } from "motion/react";
import type { SceneKind } from "@/lib/treatments";
import { useNoHover } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import "./treatment-art.css";

// Class names from treatment-art.css.
const s = {
  art: "treatment-art",
  tissue: "ta-tissue",
  tissueStrong: "ta-tissue-strong",
  faint: "ta-faint",
  tube: "ta-tube",
  vein: "ta-vein",
  glow: "ta-glow",
  cone: "ta-cone",
  lens: "ta-lens",
  stone: "ta-stone",
};

/**
 * Small animated illustration of each procedure. It plays while its card is
 * hovered or focused, while on screen on touch devices (or always on screen
 * with `autoplay`), or whenever `live` is set by the parent.
 */
export function TreatmentArt({
  kind,
  live = false,
  autoplay = false,
  className,
}: {
  kind: SceneKind;
  live?: boolean;
  autoplay?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const noHover = useNoHover();
  const [engaged, setEngaged] = useState(false);

  // Follow hover and keyboard focus on the card (the enclosing link) the art sits in.
  useEffect(() => {
    const card = ref.current?.closest("a") ?? ref.current?.parentElement;
    if (!card) return;
    const on = () => setEngaged(true);
    const off = () => setEngaged(false);
    card.addEventListener("pointerenter", on);
    card.addEventListener("pointerleave", off);
    card.addEventListener("focusin", on);
    card.addEventListener("focusout", off);
    return () => {
      card.removeEventListener("pointerenter", on);
      card.removeEventListener("pointerleave", off);
      card.removeEventListener("focusin", on);
      card.removeEventListener("focusout", off);
    };
  }, []);

  const playing = live || engaged || ((autoplay || noHover) && inView);
  const Art = ART[kind];

  return (
    <div ref={ref} aria-hidden data-live={playing || undefined} className={cn(s.art, className)}>
      <Art />
    </div>
  );
}

const svg = {
  viewBox: "0 0 240 150",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  preserveAspectRatio: "xMidYMid meet",
} as const;

const vars = (v: Record<string, string | number>) => v as CSSProperties;

/** Kidney with its calyces, drawn from the top of the outline (hilum on the left). */
function Kidney({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        className={s.tissue}
        d="M0 0 C23 0 36 24 36 50 C36 76 23 100 0 100 C-17 100 -27 89 -25 77 C-24 69 -15 65 -15 55 C-15 45 -24 41 -25 33 C-27 12 -17 0 0 0 Z"
      />
      <g className={s.faint}>
        <path d="M-14 56 C-6 54 -1 46 2 36 M-8 56 C2 55 10 56 18 60 M-12 61 C-4 68 2 76 6 84" />
        <circle cx={2} cy={34} r={2.4} />
        <circle cx={20} cy={61} r={2.4} />
        <circle cx={7} cy={86} r={2.4} />
      </g>
    </g>
  );
}

/* A flexible scope goes up the ureter and a laser breaks the stone into dust. */
const DUST = [
  [-7, -5],
  [6, -7],
  [8, 4],
  [-5, 7],
  [1, 9],
  [-9, 1],
];
function LaserArt() {
  return (
    <svg {...svg}>
      <Kidney x={162} y={16} />
      <path className={s.tube} d="M148 74 C131 80 119 92 105 108 C92 123 70 133 24 143" />
      <path strokeWidth={2.2} d="M24 143 C70 133 92 123 105 108 C119 92 131 82 147 80 C155 79 160 84 162 90" />
      <path data-a="beam" strokeWidth={2} d="M163.5 93.5 L169 100" />
      <circle data-a="tip" className={s.glow} cx={162} cy={91} r={2.4} />
      <polygon data-a="stone" className={s.stone} points="166,100 169,95 176,96 179,102 175,108 168,107" />
      {DUST.map(([dx, dy]) => (
        <circle
          key={`${dx},${dy}`}
          data-a="dust"
          className={s.stone}
          cx={172}
          cy={102}
          r={1.3}
          style={vars({ "--dx": `${dx}px`, "--dy": `${dy}px` })}
        />
      ))}
    </svg>
  );
}

/* A sheath through the back into the kidney; fragments come out along it. */
function PcnlArt() {
  return (
    <svg {...svg}>
      <path className={s.faint} d="M0 116 C70 108 150 110 240 122" />
      <path d="M0 126 C70 118 150 120 240 132" />
      <Kidney x={137} y={12} />
      <polygon className={s.tissue} points="210.7,140 152.7,87 147.3,93 205.3,146" />
      <path d="M210.7 140 L152.7 87 M205.3 146 L147.3 93" />
      <polygon data-a="shrink" className={s.stone} points="133,78 137,71 145,71 150,77 147,85 139,86" />
      <circle data-a="pulse" className={s.glow} cx={150} cy={90} r={2} />
      {[0, 0.9, 1.8].map((d) => (
        <circle
          key={d}
          data-a="frag"
          className={s.stone}
          cx={148}
          cy={88}
          r={2.2}
          style={{ animationDelay: `${d}s` }}
        />
      ))}
    </svg>
  );
}

/* Focused shock waves travel from outside the body and crack the stone. */
const WAVES = [
  { delay: 0, rest: 18, scale: 0.85 },
  { delay: 0.5, rest: 56, scale: 0.6 },
  { delay: 1, rest: 94, scale: 0.4 },
];
function EswlArt() {
  return (
    <svg {...svg}>
      <path className={s.faint} d="M86 150 C82 112 90 70 110 0" />
      <path d="M94 150 C90 112 98 70 118 0" />
      <Kidney x={168} y={14} />
      <g transform="rotate(-22.5 34 124)">
        <ellipse className={s.tissue} strokeOpacity={0.3} cx={56} cy={124} rx={9} ry={15} />
        <rect className={s.tissueStrong} x={16} y={112} width={10} height={24} rx={3} />
        <path strokeWidth={2.4} d="M44 108 Q28 124 44 140" />
        <path className={s.faint} strokeDasharray="2 5" d="M60 124 H182" />
        {WAVES.map((w) => (
          <path
            key={w.delay}
            data-a="wave"
            d="M50 112 Q58 124 50 136"
            style={vars({ animationDelay: `-${w.delay}s`, "--rest": `${w.rest}px`, "--rest-scale": w.scale })}
          />
        ))}
      </g>
      <circle data-a="spin" className={s.faint} strokeDasharray="2 3" cx={174} cy={66} r={11} />
      <polygon data-a="half-l" className={s.stone} points="168,64 171,59 175,60 174,66 172,72 167,70" />
      <polygon data-a="half-r" className={s.stone} points="175,60 180,62 181,68 177,72 172,72 174,66" />
      <path data-a="crack" strokeWidth={1.2} d="M175 60 L174 66 L172 72" />
    </svg>
  );
}

/* The resectoscope loop trims the enlarged prostate, then urine flows again. */
const CHIPS = [
  { dx: -14, dy: -46, delay: 0 },
  { dx: 10, dy: -52, delay: 0.6 },
  { dx: -2, dy: -40, delay: 1.2 },
];
function TurpArt() {
  return (
    <svg {...svg}>
      <path
        className={s.tissue}
        d="M120 64 C98 64 70 58 64 38 C58 17 86 5 120 5 C154 5 182 17 176 38 C170 58 142 64 120 64 Z"
      />
      <path className={s.faint} d="M114 62 V150 M126 62 V150" />
      <ellipse data-a="lobe" className={s.tissueStrong} cx={103} cy={90} rx={21} ry={25} style={{ transformOrigin: "0% 50%" }} />
      <ellipse data-a="lobe" className={s.tissueStrong} cx={137} cy={90} rx={21} ry={25} style={{ transformOrigin: "100% 50%" }} />
      <path data-a="flow" strokeDasharray="3 5" d="M120 70 V150" />
      <g data-a="scope">
        <path strokeWidth={2.2} d="M120 150 V104" />
        <path d="M114.5 104 A5.5 5.5 0 0 1 125.5 104" />
        <circle className={s.glow} cx={120} cy={98.5} r={1.6} />
      </g>
      {CHIPS.map((c) => (
        <circle
          key={c.delay}
          data-a="chip"
          className={s.glow}
          cx={120}
          cy={96}
          r={1.7}
          style={vars({ "--dx": `${c.dx}px`, "--dy": `${c.dy}px`, animationDelay: `${c.delay}s` })}
        />
      ))}
    </svg>
  );
}

/* Instruments and a camera through small ports in the abdominal wall. */
function LapArt() {
  const pivot = (x: number, y: number): CSSProperties => ({ transformOrigin: `${x}px ${y}px`, transformBox: "view-box" });
  return (
    <svg {...svg}>
      <path className={s.tissue} d="M0 50 C70 20 170 20 240 50 L240 60 C170 30 70 30 0 60 Z" />
      <g data-a="camera" style={pivot(120, 29)}>
        <polygon className={s.cone} points="120,64 94,110 146,110" />
        <path strokeWidth={2.4} d="M120 8 V64" />
        <rect className={s.tissueStrong} x={114} y={1} width={12} height={9} rx={2} />
      </g>
      <path
        className={s.tissue}
        d="M84 112 C84 97 99 92 111 98 C117 101 123 101 129 98 C141 92 156 97 156 112 C156 126 140 132 120 132 C100 132 84 126 84 112 Z"
      />
      <ellipse data-a="ants" className={s.faint} strokeDasharray="3 4" cx={120} cy={113} rx={46} ry={27} />
      <g data-a="tool" style={pivot(70, 33)}>
        <path strokeWidth={2} d="M53 4 L106 95" />
        <path d="M101 90 L107 97 L110 89" />
      </g>
      <g data-a="tool" style={{ ...pivot(170, 33), animationDelay: "-1.6s" }}>
        <path strokeWidth={2} d="M187 4 L134 95" />
        <path d="M130 89 L133 97 L139 90" />
      </g>
      {[
        [70, 33, -30],
        [120, 29.5, 0],
        [170, 33, 30],
      ].map(([x, y, a]) => (
        <rect
          key={x}
          className={s.tissueStrong}
          x={x - 4}
          y={y - 9}
          width={8}
          height={18}
          rx={2}
          transform={`rotate(${a} ${x} ${y})`}
        />
      ))}
    </svg>
  );
}

/* Swollen veins above the testis are tied under the microscope and shrink. */
const VEINS = [
  "M112 92 C100 84 124 76 110 68 C96 60 122 52 108 44 C94 36 120 28 108 20 C100 14 112 8 110 0",
  "M127 92 C139 84 115 76 129 68 C143 60 117 52 131 44 C145 36 119 28 133 20 C140 14 128 6 130 0",
];
function VaricoceleArt() {
  return (
    <svg {...svg}>
      <ellipse className={s.tissue} cx={120} cy={119} rx={21} ry={27} />
      <path className={s.faint} d="M137 100 C148 108 148 132 135 143 M120 92 V0 M132 96 C135 70 130 40 134 0" />
      {VEINS.map((d) => (
        <path key={`v${d}`} data-a="vein" className={s.vein} d={d} />
      ))}
      {VEINS.map((d) => (
        <path key={`l${d}`} strokeWidth={1.2} d={d} />
      ))}
      {VEINS.map((d) => (
        <path key={`f${d}`} data-a="flow" strokeWidth={1.6} strokeDasharray="2 6" d={d} />
      ))}
      <g data-a="lens">
        <circle className={s.lens} strokeWidth={1.8} cx={120} cy={46} r={24} />
        <path data-a="spin" className={s.faint} d="M120 26 V34 M120 58 V66 M100 46 H108 M132 46 H140" />
        <path strokeWidth={2.4} d="M137 29 L158 8" />
      </g>
      <path data-a="tie" strokeWidth={2.2} d="M104 47 L117 50" />
      <path data-a="tie" strokeWidth={2.2} d="M123 39 L136 42" />
    </svg>
  );
}

const ART: Record<SceneKind, () => React.ReactElement> = {
  laser: LaserArt,
  pcnl: PcnlArt,
  eswl: EswlArt,
  turp: TurpArt,
  lap: LapArt,
  varicocele: VaricoceleArt,
};
