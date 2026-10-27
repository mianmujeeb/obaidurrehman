"use client";

import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { useCallback, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import type { OrganId } from "@/lib/doctor";
import { cn } from "@/lib/utils";
import { createKidneyGeometry, createTaperedTube } from "./geometry";
import { Studio, stepDrag, type DragState } from "./studio";

type SceneProps = {
  selected: OrganId;
  onSelect: (id: OrganId) => void;
  dark: boolean;
  reduced: boolean;
  active: boolean;
  dragRef: RefObject<DragState>;
  onReady: () => void;
};

const LABELS: Record<OrganId, string> = {
  kidney: "Kidney",
  ureter: "Ureter",
  bladder: "Bladder",
  prostate: "Prostate",
};
const ORGAN_IDS = Object.keys(LABELS) as OrganId[];

type LabelEls = Partial<Record<OrganId, HTMLButtonElement | null>>;

// Camera framing per organ: look-at target plus the world-space box to fit.
const FOCUS: Record<OrganId, { target: [number, number, number]; w: number; h: number }> = {
  kidney: { target: [0, 0.9, 0], w: 3.4, h: 3.0 },
  ureter: { target: [0, 0.0, 0], w: 3.4, h: 4.2 },
  bladder: { target: [0, -1.4, 0], w: 3.0, h: 3.0 },
  prostate: { target: [0, -1.8, 0], w: 2.6, h: 2.6 },
};

export default function AnatomyScene({ selected, onSelect, dark, reduced, active, dragRef, onReady }: SceneProps) {
  const [dpr, setDpr] = useState(1.5);
  const labelsRef = useRef<LabelEls>({});
  const palette = dark
    ? { base: "#5b7275", active: "#5ccfc4", glow: "#1d6e68" }
    : { base: "#b9c9cc", active: "#12938b", glow: "#0b4f4b" };

  return (
    <>
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={[1, dpr]}
        camera={{ position: [0, -0.3, 9], fov: 34 }}
        gl={{ antialias: true, alpha: true }}
        style={{ touchAction: "pan-y" }}
        onCreated={onReady}
        onPointerMissed={() => {
          document.body.style.cursor = "";
        }}
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} />
        <ambientLight intensity={dark ? 0.35 : 0.6} />
        <directionalLight position={[2, 4, 6]} intensity={dark ? 1.3 : 1.7} />
        <Studio dark={dark} />
        <CameraRig selected={selected} />
        <Body dragRef={dragRef} reduced={reduced}>
          <UrinarySystem selected={selected} onSelect={onSelect} palette={palette} labelsRef={labelsRef} />
        </Body>
      </Canvas>

      {/* Labels are plain DOM in this React tree, placed each frame by their
          organ. drei's <Html> mounts a separate root per label, which React
          reports as a race when the scene unmounts during navigation. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {ORGAN_IDS.map((id) => (
          <button
            key={id}
            ref={(el) => {
              labelsRef.current[id] = el;
            }}
            type="button"
            tabIndex={-1}
            onClick={() => onSelect(id)}
            className={cn(
              "pointer-events-auto invisible absolute left-0 top-0 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-300",
              selected === id
                ? "border-transparent bg-accent text-accent-ink"
                : "border-line bg-surface/85 text-ink backdrop-blur hover:border-accent",
            )}
          >
            {LABELS[id]}
          </button>
        ))}
      </div>
    </>
  );
}

function CameraRig({ selected }: { selected: OrganId }) {
  const lookRef = useRef(new THREE.Vector3(0, -0.3, 0));

  useFrame((state, dt) => {
    const f = FOCUS[selected];
    const cam = state.camera as THREE.PerspectiveCamera;
    const aspect = state.size.width / Math.max(1, state.size.height);
    const tan = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    const dist = Math.max(f.h / (2 * tan), f.w / (2 * tan * aspect)) * 1.12;
    const [tx, ty, tz] = f.target;

    cam.position.x = THREE.MathUtils.damp(cam.position.x, tx, 3, dt);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, ty + 0.15, 3, dt);
    cam.position.z = THREE.MathUtils.damp(cam.position.z, tz + dist, 3, dt);

    const look = lookRef.current;
    look.set(
      THREE.MathUtils.damp(look.x, tx, 3, dt),
      THREE.MathUtils.damp(look.y, ty, 3, dt),
      THREE.MathUtils.damp(look.z, tz, 3, dt),
    );
    cam.lookAt(look);
  });

  return null;
}

function Body({
  dragRef,
  reduced,
  children,
}: {
  dragRef: RefObject<DragState>;
  reduced: boolean;
  children: React.ReactNode;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const drag = dragRef.current;
    stepDrag(drag, dt);
    const sway = reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.35) * 0.22;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, drag.yaw + sway, 5, dt);
  });

  return <group ref={group}>{children}</group>;
}

type Palette = { base: string; active: string; glow: string };

function UrinarySystem({
  selected,
  onSelect,
  palette,
  labelsRef,
}: {
  selected: OrganId;
  onSelect: (id: OrganId) => void;
  palette: Palette;
  labelsRef: RefObject<LabelEls>;
}) {
  const kidney = useMemo(() => createKidneyGeometry(72), []);
  const ureters = useMemo(() => {
    const right: [number, number, number][] = [
      [0.92, 1.12, 0.06],
      [0.8, 0.62, -0.04],
      [0.64, -0.2, -0.1],
      [0.46, -0.86, -0.06],
      [0.3, -1.16, 0],
    ];
    const left = right.map(([x, y, z]) => [-x, y, z] as [number, number, number]);
    return [createTaperedTube(right, 0.05, 0.8, 80, 12), createTaperedTube(left, 0.05, 0.8, 80, 12)];
  }, []);
  const urethra = useMemo(
    () =>
      createTaperedTube(
        [
          [0, -1.72, 0.02],
          [0, -2.08, 0.04],
          [0, -2.4, 0.16],
          [0, -2.62, 0.4],
        ],
        0.045,
        0.7,
        48,
        12,
      ),
    [],
  );

  const shared = { selected, onSelect, palette, labelsRef };

  return (
    <group>
      <Organ id="kidney" {...shared} label={[1.0, 1.95, 0]}>
        <mesh geometry={kidney} position={[1.05, 1.2, 0]} rotation={[0, 0, 0.2]} scale={[0.52, 0.56, 0.52]} />
        <mesh geometry={kidney} position={[-1.05, 1.2, 0]} rotation={[0, 0, -0.2]} scale={[-0.52, 0.56, 0.52]} />
      </Organ>
      <Organ id="ureter" {...shared} label={[-1.05, 0.1, 0]}>
        <mesh geometry={ureters[0]} />
        <mesh geometry={ureters[1]} />
      </Organ>
      <Organ id="bladder" {...shared} label={[0.85, -1.05, 0]}>
        <mesh position={[0, -1.33, 0]} scale={[0.6, 0.5, 0.5]}>
          <sphereGeometry args={[1, 48, 48]} />
        </mesh>
        <mesh geometry={urethra} />
      </Organ>
      <Organ id="prostate" {...shared} label={[-0.7, -2.1, 0]}>
        <mesh position={[0, -1.98, 0.03]} scale={[0.27, 0.2, 0.23]}>
          <sphereGeometry args={[1, 40, 40]} />
        </mesh>
      </Organ>
    </group>
  );
}

const tmpColor = new THREE.Color();
const tmpVec = new THREE.Vector3();

/**
 * Groups meshes into one selectable organ. All child meshes share a material
 * that eases between the resting and highlighted look every frame, and the
 * organ pins its DOM label to the projected label point.
 */
function Organ({
  id,
  selected,
  onSelect,
  palette,
  label,
  labelsRef,
  children,
}: {
  id: OrganId;
  selected: OrganId;
  onSelect: (id: OrganId) => void;
  palette: Palette;
  label: [number, number, number];
  labelsRef: RefObject<LabelEls>;
  children: React.ReactNode;
}) {
  const materialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const anchorRef = useRef<THREE.Object3D>(null);
  const hoverRef = useRef(false);
  const isActive = selected === id;

  useFrame((state, dt) => {
    const el = labelsRef.current[id];
    const anchor = anchorRef.current;
    if (el && anchor) {
      anchor.getWorldPosition(tmpVec).project(state.camera);
      const x = (tmpVec.x + 1) * 0.5 * state.size.width;
      const y = (1 - tmpVec.y) * 0.5 * state.size.height;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      el.style.visibility = "visible";
    }

    const m = materialRef.current;
    if (!m) return;
    const k = 1 - Math.exp(-6 * dt);
    const lit = isActive || hoverRef.current;
    m.color.lerp(tmpColor.set(isActive ? palette.active : palette.base), k);
    m.emissive.lerp(tmpColor.set(lit ? palette.glow : "#000000"), k);
    m.emissiveIntensity = isActive ? 0.35 : 0.2;
    m.opacity = THREE.MathUtils.lerp(m.opacity, lit ? 1 : 0.55, k);
    m.depthWrite = m.opacity > 0.9;
  });

  const baseColor = palette.base;
  const attachMaterial = useCallback((group: THREE.Group | null) => {
    if (!group) return;
    materialRef.current ??= new THREE.MeshPhysicalMaterial({
      color: baseColor,
      roughness: 0.32,
      metalness: 0.02,
      clearcoat: 0.9,
      clearcoatRoughness: 0.2,
      sheen: 0.6,
      transparent: true,
    });
    const material = materialRef.current;
    group.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) (obj as THREE.Mesh).material = material;
    });
    return () => {
      material.dispose();
      materialRef.current = null;
    };
  }, [baseColor]);

  function select(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation();
    if (e.delta > 8) return;
    onSelect(id);
  }

  return (
    <group
      ref={attachMaterial}
      onClick={select}
      onPointerOver={(e) => {
        e.stopPropagation();
        hoverRef.current = true;
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        hoverRef.current = false;
        document.body.style.cursor = "";
      }}
    >
      {children}
      <object3D ref={anchorRef} position={label} />
    </group>
  );
}
