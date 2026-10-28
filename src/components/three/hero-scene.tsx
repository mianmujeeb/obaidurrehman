"use client";

import { Canvas, extend, useFrame, type ThreeElement } from "@react-three/fiber";
import { Float, PerformanceMonitor, Sparkles, shaderMaterial } from "@react-three/drei";
import { useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { mergeGeometries, mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { seeded } from "@/lib/utils";
import { createKidneyGeometry, createProfiledTube } from "./geometry";
import { Studio, stepDrag, type DragState } from "./studio";

type SceneProps = {
  dark: boolean;
  reduced: boolean;
  active: boolean;
  dragRef: RefObject<DragState>;
  onReady: () => void;
  /** Small card version: lighter sparkles and no lift on scroll. */
  compact?: boolean;
};

/*
  Hero artwork: a glass kidney with its collecting system (pelvis, calyces,
  ureter) showing through, stones lodged in the calyces, and a laser fibre that
  has come up the ureter, as in laser stone surgery. Tissue is drawn with a
  fresnel "X-ray glass" shader so the stones are the only solid, warm objects.
*/

const GlassMaterial = shaderMaterial(
  {
    uBase: new THREE.Color(),
    uRim: new THREE.Color(),
    uScanColor: new THREE.Color(),
    uBaseAlpha: 0.1,
    uRimAlpha: 0.9,
    uPower: 2.4,
    uShine: 0.5,
    uScan: 10,
    uFadeY: -10,
  },
  /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vView;
    varying vec3 vPos;
    void main() {
      vPos = position;
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vNormal = normalize(normalMatrix * normal);
      vView = -mv.xyz;
      gl_Position = projectionMatrix * mv;
    }
  `,
  /* glsl */ `
    uniform vec3 uBase;
    uniform vec3 uRim;
    uniform vec3 uScanColor;
    uniform float uBaseAlpha;
    uniform float uRimAlpha;
    uniform float uPower;
    uniform float uShine;
    uniform float uScan;
    uniform float uFadeY;
    varying vec3 vNormal;
    varying vec3 vView;
    varying vec3 vPos;
    void main() {
      vec3 n = normalize(vNormal);
      vec3 v = normalize(vView);
      float fres = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), uPower);
      vec3 color = mix(uBase, uRim, fres);
      float alpha = mix(uBaseAlpha, uRimAlpha, fres);

      // Studio highlight fixed to the camera, so it slides over the glass as it turns.
      vec3 l = normalize(vec3(-0.5, 0.8, 0.7));
      float spec = pow(max(dot(reflect(-l, n), v), 0.0), 40.0) * uShine;
      color += spec;
      alpha = min(1.0, alpha + spec);

      // Scan line sweeping the model in its own space, like an imaging slice.
      float band = exp(-pow((vPos.y - uScan) / 0.03, 2.0));
      color = mix(color, uScanColor, band);
      alpha = max(alpha, band * 0.85);

      // Lets the ureter and fibre trail off instead of ending in a hard cut.
      alpha *= smoothstep(uFadeY - 0.45, uFadeY, vPos.y);
      gl_FragColor = vec4(color, alpha);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `,
);
type GlassMaterialImpl = InstanceType<typeof GlassMaterial>;

extend({ GlassMaterial });
declare module "@react-three/fiber" {
  interface ThreeElements {
    glassMaterial: ThreeElement<typeof GlassMaterial>;
  }
}

type Glass = { base: string; rim: string; baseAlpha: number; rimAlpha: number };
type Palette = {
  shell: Glass;
  inner: Glass;
  system: Glass;
  fiber: string;
  glow: string;
  scan: string;
  stone: string;
  sparkle: string;
};

const LIGHT: Palette = {
  shell: { base: "#1c968e", rim: "#0b6e6a", baseAlpha: 0.07, rimAlpha: 0.78 },
  inner: { base: "#1c968e", rim: "#0b6e6a", baseAlpha: 0.02, rimAlpha: 0.2 },
  system: { base: "#2fb3a6", rim: "#0b6e6a", baseAlpha: 0.4, rimAlpha: 0.95 },
  fiber: "#21494b",
  glow: "#12a89c",
  scan: "#0fa59b",
  stone: "#c99a4b",
  sparkle: "#0b6e6a",
};

const DARK: Palette = {
  shell: { base: "#5ccfc4", rim: "#8fe0d8", baseAlpha: 0.05, rimAlpha: 0.85 },
  inner: { base: "#5ccfc4", rim: "#5ccfc4", baseAlpha: 0.02, rimAlpha: 0.22 },
  system: { base: "#2aa59a", rim: "#b5f7ef", baseAlpha: 0.45, rimAlpha: 1 },
  fiber: "#d6f3ef",
  glow: "#8ff0e6",
  scan: "#a8f5ec",
  stone: "#dcbf86",
  sparkle: "#8ff0e6",
};

export default function HeroScene({ dark, reduced, active, dragRef, onReady, compact = false }: SceneProps) {
  const [dpr, setDpr] = useState(1.5);
  const palette = dark ? DARK : LIGHT;

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, dpr]}
      camera={{ position: [0, 0, compact ? 5.3 : 6.2], fov: 32 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ touchAction: "pan-y" }}
      onCreated={onReady}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(1.75)} />
      <ambientLight intensity={dark ? 0.35 : 0.6} />
      <directionalLight position={[3, 4, 5]} intensity={dark ? 1.3 : 1.7} />
      <Studio dark={dark} />
      <Rig dragRef={dragRef} reduced={reduced} lift={!compact}>
        <Float speed={reduced ? 0 : 1.2} rotationIntensity={0.15} floatIntensity={reduced ? 0 : 0.4}>
          <group rotation={[0.04, 0.3, 0.16]} scale={1.3} position={[0.08, 0.2, 0]}>
            <GlassKidney palette={palette} reduced={reduced} />
            <StoneLaser palette={palette} reduced={reduced} />
          </group>
        </Float>
      </Rig>
      <Sparkles
        count={compact ? 28 : 70}
        scale={compact ? [3, 3.4, 1.6] : [4.2, 4.2, 2.2]}
        size={dark ? 2.2 : 2.8}
        speed={reduced ? 0 : 0.25}
        opacity={dark ? 0.6 : 0.45}
        noise={0.6}
        color={palette.sparkle}
      />
    </Canvas>
  );
}

function Rig({
  dragRef,
  reduced,
  lift,
  children,
}: {
  dragRef: RefObject<DragState>;
  reduced: boolean;
  lift: boolean;
  children: React.ReactNode;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const drag = dragRef.current;
    stepDrag(drag, dt);

    // Scroll progress through the first screen; the model turns and lifts away.
    const scroll = Math.min(window.scrollY / window.innerHeight, 1.4);
    const idle = reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.25) * 0.45;
    const yaw = drag.yaw + idle + state.pointer.x * 0.3 + scroll * 1.4;
    const pitch = -state.pointer.y * 0.12 + scroll * 0.25;

    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, yaw, 5, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, pitch, 5, dt);
    if (lift) g.position.y = THREE.MathUtils.damp(g.position.y, scroll * 1.1, 5, dt);
  });

  return <group ref={group}>{children}</group>;
}

/* Collecting system, in the kidney's own space (hilum on -X, poles on ±Y). */
type P3 = [number, number, number];

const UP = new THREE.Vector3(0, 1, 0);
const PELVIS: P3 = [0.02, 0, 0];
const TIP = new THREE.Vector3(-0.04, -0.03, 0.01);
const URETER: P3[] = [PELVIS, [-0.17, -0.07, 0.01], [-0.33, -0.28, 0.02], [-0.42, -0.72, 0.02], [-0.38, -1.2, 0], [-0.3, -1.75, 0]];
const FIBRE: P3[] = [[-0.3, -1.9, 0], [-0.38, -1.2, 0], [-0.42, -0.72, 0.02], [-0.33, -0.28, 0.02], [-0.17, -0.07, 0.01], TIP.toArray()];

const MAJOR: { path: P3[]; r: number }[] = [
  { path: [[0, 0.04, 0], [0.04, 0.27, 0], [0.08, 0.46, 0]], r: 0.075 },
  { path: [[0.06, 0, 0], [0.22, 0.05, 0], [0.36, 0.1, 0]], r: 0.07 },
  { path: [[0, -0.04, 0], [0.04, -0.27, 0], [0.08, -0.46, 0]], r: 0.075 },
];

const MINOR: { path: P3[]; cup: number }[] = [
  { path: [[0.08, 0.46, 0], [0.01, 0.62, 0.04], [-0.06, 0.76, 0.06]], cup: 0.06 },
  { path: [[0.08, 0.46, 0], [0.11, 0.64, 0], [0.1, 0.8, 0]], cup: 0.055 },
  { path: [[0.08, 0.46, 0], [0.17, 0.57, -0.03], [0.25, 0.66, -0.06]], cup: 0.06 },
  { path: [[0.36, 0.1, 0], [0.44, 0.21, 0.03], [0.48, 0.3, 0.04]], cup: 0.06 },
  { path: [[0.36, 0.1, 0], [0.45, 0.03, -0.03], [0.5, -0.06, -0.04]], cup: 0.055 },
  { path: [[0.08, -0.46, 0], [0.01, -0.62, 0.04], [-0.06, -0.76, 0.06]], cup: 0.06 },
  { path: [[0.08, -0.46, 0], [0.11, -0.64, 0], [0.1, -0.8, 0]], cup: 0.055 },
  { path: [[0.08, -0.46, 0], [0.17, -0.57, -0.03], [0.25, -0.66, -0.06]], cup: 0.065 },
];

function bulb(at: P3, r: number, squash: P3 = [1, 1, 1]) {
  const g = new THREE.SphereGeometry(r, 20, 16);
  g.scale(...squash);
  g.translate(...at);
  return g;
}

/** Flattened cap that closes a flared calyx, facing along the branch. */
function cupCap(path: P3[], r: number) {
  const end = new THREE.Vector3(...path[path.length - 1]);
  const dir = end.clone().sub(new THREE.Vector3(...path[path.length - 2])).normalize();
  const g = new THREE.SphereGeometry(r, 20, 12);
  g.scale(1, 0.4, 1);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(UP, dir));
  g.translate(end.x, end.y, end.z);
  return g;
}

function createCollectingSystem() {
  const { smoothstep, lerp } = THREE.MathUtils;
  const parts = [
    // Funnel-shaped pelvis narrowing quickly into the ureter at the hilum.
    createProfiledTube(URETER, (t) => 0.042 + 0.1 * (1 - smoothstep(t, 0.02, 0.2)) - 0.012 * t, 120, 18),
    bulb([0.05, 0, 0], 0.13, [1.25, 1, 0.6]),
    ...MAJOR.map((m) => createProfiledTube(m.path, (t) => m.r * (1 - 0.35 * t), 24, 14)),
    ...MAJOR.map((m) => bulb(m.path[2], m.r * 0.66)),
    // Minor calyces narrow, then flare into a cup where they meet the kidney tissue.
    ...MINOR.map((m) =>
      createProfiledTube(m.path, (t) => lerp(0.036, 0.028, t) + (m.cup - 0.028) * smoothstep(t, 0.45, 1), 28, 14),
    ),
    ...MINOR.map((m) => cupCap(m.path, m.cup)),
  ];
  const merged = mergeGeometries(parts);
  for (const p of parts) p.dispose();
  return merged;
}

function GlassKidney({ palette, reduced }: { palette: Palette; reduced: boolean }) {
  const shell = useMemo(() => createKidneyGeometry(112), []);
  const system = useMemo(() => createCollectingSystem(), []);
  const fibre = useMemo(() => createProfiledTube(FIBRE, () => 0.011, 120, 8), []);
  const scanned = useRef<(GlassMaterialImpl | null)[]>([]);

  useFrame((state) => {
    // Sweep top to bottom over ~4s, rest, repeat. Parked off the model when reduced.
    const t = state.clock.elapsedTime % 7;
    const y = reduced || t > 4.2 ? 10 : 1.25 - (t / 4.2) * 2.5;
    for (const m of scanned.current) if (m) m.uScan = y;
  });

  const glass = (g: Glass, slot: number, extra?: { uFadeY?: number; uPower?: number; uShine?: number }) => (
    <glassMaterial
      ref={(m: GlassMaterialImpl | null) => {
        scanned.current[slot] = m;
      }}
      transparent
      depthWrite={false}
      toneMapped={false}
      uBase={g.base}
      uRim={g.rim}
      uBaseAlpha={g.baseAlpha}
      uRimAlpha={g.rimAlpha}
      uScanColor={palette.scan}
      {...extra}
    />
  );

  return (
    <>
      {/* Drawn back to front: fibre, collecting system, inner cortex, outer capsule. */}
      <mesh geometry={fibre} renderOrder={1}>
        <glassMaterial
          transparent
          depthWrite={false}
          toneMapped={false}
          uBase={palette.fiber}
          uRim={palette.fiber}
          uBaseAlpha={0.95}
          uRimAlpha={0.95}
          uShine={0.8}
          uFadeY={-0.85}
        />
      </mesh>
      <mesh geometry={system} renderOrder={2}>
        {glass(palette.system, 0, { uFadeY: -0.8, uPower: 1.8, uShine: 0.7 })}
      </mesh>
      <mesh geometry={shell} scale={0.9} renderOrder={3}>
        {glass(palette.inner, 1, { uShine: 0 })}
      </mesh>
      <mesh geometry={shell} renderOrder={4}>
        {glass(palette.shell, 2, { uPower: 2.6, uShine: 0.55 })}
      </mesh>
    </>
  );
}

const STONES: { at: P3; size: number; seed: number }[] = [
  { at: [0.25, -0.66, -0.06], size: 0.1, seed: 3 },
  { at: [0.48, 0.3, 0.04], size: 0.076, seed: 7 },
  { at: [-0.06, 0.76, 0.06], size: 0.068, seed: 11 },
  { at: [0.1, -0.8, 0], size: 0.058, seed: 19 },
];

const SHARDS = 12;
const scratch = new THREE.Object3D();
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutBack = (t: number) => 1 + 2.4 * Math.pow(t - 1, 3) + 1.4 * Math.pow(t - 1, 2);

/** Faceted, slightly irregular stone (shared vertices so the jitter never cracks it). */
function createStoneGeometry(seed: number) {
  const base = new THREE.IcosahedronGeometry(1, 1);
  base.deleteAttribute("normal");
  base.deleteAttribute("uv");
  const geo = mergeVertices(base);
  base.dispose();
  const rand = seeded(seed);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).multiplyScalar(0.78 + rand() * 0.42);
    pos.setXYZ(i, v.x, v.y * 0.85, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

type Phase = { phase: "idle" | "burst" | "regrow"; t: number };

/**
 * Stones and the laser. Tap a stone (or wait) and the fibre fires: a short beam,
 * the stone breaks into dust, then it regrows so the scene can loop.
 */
function StoneLaser({ palette, reduced }: { palette: Palette; reduced: boolean }) {
  const geometries = useMemo(() => STONES.map((s) => createStoneGeometry(s.seed)), []);
  const scatter = useMemo(
    () =>
      STONES.map((s) => {
        const rand = seeded(s.seed * 97 + 5);
        return Array.from({ length: SHARDS }, () =>
          new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize().multiplyScalar(0.5 + rand()),
        );
      }),
    [],
  );
  // Beam from the fibre tip to each stone: centre, orientation and length.
  const beams = useMemo(
    () =>
      STONES.map((s) => {
        const dir = new THREE.Vector3(...s.at).sub(TIP);
        const length = dir.length();
        return {
          position: TIP.clone().addScaledVector(dir, 0.5),
          quaternion: new THREE.Quaternion().setFromUnitVectors(UP, dir.normalize()),
          length,
        };
      }),
    [],
  );

  const stoneRefs = useRef<(THREE.Mesh | null)[]>([]);
  const shardRefs = useRef<(THREE.InstancedMesh | null)[]>([]);
  const beamRef = useRef<THREE.Group>(null);
  const beamMat = useRef<GlassMaterialImpl>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const impactRef = useRef<THREE.Mesh>(null);
  const impactMat = useRef<GlassMaterialImpl>(null);
  const sim = useRef({
    phases: STONES.map((): Phase => ({ phase: "idle", t: 0 })),
    beam: 0,
    target: 0,
    next: 0,
    wait: 2.5,
  });

  function fire(i: number) {
    const s = sim.current;
    if (s.phases[i].phase !== "idle") return;
    s.phases[i] = { phase: "burst", t: 0 };
    s.beam = 0.32;
    s.target = i;
    s.wait = 4.5;
  }

  useFrame((state, dt) => {
    const s = sim.current;

    // Fire on its own every few seconds so the story plays without a tap.
    if (!reduced) {
      s.wait -= dt;
      if (s.wait <= 0) {
        fire(s.next);
        s.next = (s.next + 1) % STONES.length;
        s.wait = 4.5;
      }
    }

    STONES.forEach((spec, i) => {
      const stone = stoneRefs.current[i];
      const shards = shardRefs.current[i];
      if (!stone || !shards) return;
      const p = s.phases[i];
      if (!reduced) {
        stone.rotation.x += dt * 0.25;
        stone.rotation.y += dt * 0.18;
      }

      if (p.phase === "burst") {
        p.t += dt;
        const k = Math.min(p.t / 0.9, 1);
        stone.scale.setScalar(spec.size * Math.max(0, 1 - Math.max(0, p.t - 0.12) * 9));
        shards.visible = p.t > 0.12 && k < 1;
        for (let j = 0; j < SHARDS; j++) {
          // Dust stays near the calyx rather than flying through the kidney wall.
          scratch.position.copy(scatter[i][j]).multiplyScalar(easeOut(k) * spec.size * 3.2);
          scratch.rotation.set(k * 7 + j, k * 5, j);
          scratch.scale.setScalar(spec.size * 0.45 * (1 - k));
          scratch.updateMatrix();
          shards.setMatrixAt(j, scratch.matrix);
        }
        shards.instanceMatrix.needsUpdate = true;
        if (p.t > 2.4) s.phases[i] = { phase: "regrow", t: 0 };
      } else if (p.phase === "regrow") {
        p.t += dt;
        const k = Math.min(p.t / 0.7, 1);
        stone.scale.setScalar(spec.size * Math.max(0, easeOutBack(k)));
        if (k >= 1) s.phases[i] = { phase: "idle", t: 0 };
      }
    });

    s.beam = Math.max(0, s.beam - dt);
    const beam = beamRef.current;
    if (beam) {
      beam.visible = s.beam > 0;
      if (beam.visible) {
        const b = beams[s.target];
        const flicker = 1 + Math.sin(state.clock.elapsedTime * 90) * 0.25;
        beam.position.copy(b.position);
        beam.quaternion.copy(b.quaternion);
        beam.scale.set(flicker, b.length, flicker);
        if (beamMat.current) beamMat.current.uBaseAlpha = (s.beam / 0.32) * 0.9;
      }
    }

    // Flash where the beam meets the stone, swelling as it fades.
    const impact = impactRef.current;
    if (impact) {
      impact.visible = s.beam > 0;
      if (impact.visible) {
        const spec = STONES[s.target];
        impact.position.set(...spec.at);
        impact.scale.setScalar(spec.size * (1.4 + (0.32 - s.beam) * 9));
        if (impactMat.current) impactMat.current.uBaseAlpha = s.beam / 0.32;
      }
    }

    const glow = glowRef.current;
    if (glow) {
      const pulse = reduced ? 1 : 1 + Math.sin(state.clock.elapsedTime * 2.4) * 0.12;
      glow.scale.setScalar(pulse + s.beam * 5);
    }
  });

  return (
    <>
      {STONES.map((spec, i) => (
        <group key={spec.seed} position={spec.at}>
          <group
            onClick={(e) => {
              e.stopPropagation();
              if (e.delta > 8) return;
              fire(i);
              navigator.vibrate?.(18);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              document.body.style.cursor = "";
            }}
          >
            {/* Marked transparent (at full opacity) only so they draw after the glass
                and stay a clear amber instead of being tinted by the tissue in front. */}
            <mesh
              ref={(m) => {
                stoneRefs.current[i] = m;
              }}
              geometry={geometries[i]}
              scale={spec.size}
              renderOrder={8}
            >
              <meshPhysicalMaterial
                color={palette.stone}
                emissive={palette.stone}
                emissiveIntensity={0.18}
                roughness={0.42}
                metalness={0.05}
                clearcoat={0.4}
                flatShading
                transparent
              />
            </mesh>
            {/* Larger invisible hit area so small stones are easy to tap on phones. */}
            <mesh visible={false}>
              <sphereGeometry args={[Math.max(0.16, spec.size * 2.4), 8, 8]} />
            </mesh>
          </group>
          <instancedMesh
            ref={(m) => {
              shardRefs.current[i] = m;
            }}
            args={[undefined, undefined, SHARDS]}
            visible={false}
            renderOrder={8}
          >
            <tetrahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color={palette.stone} roughness={0.6} flatShading transparent />
          </instancedMesh>
        </group>
      ))}

      {/* Fibre tip: a soft glow that flares when the laser fires. */}
      <mesh ref={glowRef} position={TIP} renderOrder={5}>
        <sphereGeometry args={[0.045, 20, 16]} />
        <glassMaterial
          transparent
          depthWrite={false}
          toneMapped={false}
          uBase={palette.glow}
          uRim={palette.glow}
          uBaseAlpha={0.9}
          uRimAlpha={0}
          uPower={1.2}
          uShine={0}
        />
      </mesh>

      <mesh ref={impactRef} visible={false} renderOrder={9}>
        <sphereGeometry args={[1, 20, 16]} />
        <glassMaterial
          ref={impactMat}
          transparent
          depthWrite={false}
          toneMapped={false}
          uBase={palette.glow}
          uRim={palette.glow}
          uBaseAlpha={1}
          uRimAlpha={0}
          uPower={1.1}
          uShine={0}
        />
      </mesh>

      <group ref={beamRef} visible={false}>
        <mesh renderOrder={6}>
          <cylinderGeometry args={[0.028, 0.028, 1, 12, 1, true]} />
          <glassMaterial
            ref={beamMat}
            transparent
            depthWrite={false}
            toneMapped={false}
            uBase={palette.glow}
            uRim={palette.glow}
            uBaseAlpha={0.9}
            uRimAlpha={0}
            uPower={1.4}
            uShine={0}
          />
        </mesh>
        <mesh renderOrder={7}>
          <cylinderGeometry args={[0.006, 0.006, 1, 8, 1, true]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
      </group>
    </>
  );
}
