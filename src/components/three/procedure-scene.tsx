"use client";

import { Canvas, useFrame, type RootState } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import type { SceneKind } from "@/lib/treatments";
import { seeded } from "@/lib/utils";
import { createKidneyGeometry, createTaperedTube } from "./geometry";
import { Studio } from "./studio";

/*
  Procedure illustrations for the treatment pages. Each stage reads a smoothed
  step value `s` that eases toward the active step (0 to 3), so every element is
  a pure function of `s` and scrolling back simply plays the flow in reverse.
*/

type P3 = [number, number, number];
type Palette = {
  tissue: string;
  neutral: string;
  stone: string;
  metal: string;
  energy: string;
  tumour: string;
  vein: string;
};
type StageProps = { step: number; palette: Palette; reduced: boolean };

const LIGHT: Palette = {
  tissue: "#1c968e",
  neutral: "#b9c9cc",
  stone: "#c9b07a",
  metal: "#8b9a9e",
  energy: "#0fa59b",
  tumour: "#b98d63",
  vein: "#6f7d97",
};
const DARK: Palette = {
  tissue: "#36b3a8",
  neutral: "#5b7275",
  stone: "#cdb98d",
  metal: "#c3cfd1",
  energy: "#8ff0e6",
  tumour: "#c79a6f",
  vein: "#8592ad",
};

export default function ProcedureScene({
  kind,
  step,
  dark,
  reduced,
  active,
  onReady,
}: {
  kind: SceneKind;
  step: number;
  dark: boolean;
  reduced: boolean;
  active: boolean;
  onReady: () => void;
}) {
  const [dpr, setDpr] = useState(1.5);
  const palette = dark ? DARK : LIGHT;

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, dpr]}
      camera={{ position: [0, 0, 8], fov: 32 }}
      gl={{ antialias: true, alpha: true }}
      onCreated={onReady}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} />
      <ambientLight intensity={dark ? 0.35 : 0.6} />
      <directionalLight position={[3, 4, 6]} intensity={dark ? 1.3 : 1.7} />
      <Studio dark={dark} />
      <Turntable reduced={reduced}>
        <Stage kind={kind} step={step} palette={palette} reduced={reduced} />
      </Turntable>
    </Canvas>
  );
}

function Stage({ kind, ...props }: StageProps & { kind: SceneKind }) {
  switch (kind) {
    case "laser":
      return <LaserStage {...props} />;
    case "pcnl":
      return <PcnlStage {...props} />;
    case "eswl":
      return <EswlStage {...props} />;
    case "turp":
      return <TurpStage {...props} />;
    case "lap":
      return <LapStage {...props} />;
    case "varicocele":
      return <VaricoceleStage {...props} />;
  }
}

/* ---------- shared helpers ---------- */

const ph = (s: number, a: number, b: number) => THREE.MathUtils.clamp((s - a) / (b - a), 0, 1);
const sm = (t: number) => t * t * (3 - 2 * t);
const damp = THREE.MathUtils.damp;
const scratch = new THREE.Object3D();
const tmp = new THREE.Vector3();
const UP = new THREE.Vector3(0, 1, 0);

function samplePath(points: P3[], n = 64) {
  return new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))).getSpacedPoints(n);
}

function pathAt(samples: THREE.Vector3[], u: number, out: THREE.Vector3) {
  const f = THREE.MathUtils.clamp(u, 0, 1) * (samples.length - 1);
  const i = Math.min(Math.floor(f), samples.length - 2);
  return out.lerpVectors(samples[i], samples[i + 1], f - i);
}

/** Reveals a tube from its start: `p` of 0 hides it, 1 shows the full length. */
function grow(mesh: THREE.Mesh | null, p: number, tubular: number, radial: number) {
  if (!mesh) return;
  const segs = Math.round(THREE.MathUtils.clamp(p, 0, 1) * tubular);
  mesh.geometry.setDrawRange(0, segs * radial * 6);
  mesh.visible = segs > 0;
}

function fade(mesh: THREE.Object3D | null, opacity: number) {
  if (!mesh) return;
  const m = (mesh as THREE.Mesh).material as THREE.Material;
  m.opacity = opacity;
  mesh.visible = opacity > 0.01;
}

/** Quaternion that turns +Y toward `to - from`, plus the distance between them. */
function aim(from: P3, to: P3) {
  const d = new THREE.Vector3(...to).sub(new THREE.Vector3(...from));
  return { quat: new THREE.Quaternion().setFromUnitVectors(UP, d.clone().normalize()), length: d.length() };
}

/** Unit cylinder with its base at the origin, so scale.y extends it like a probe. */
function probeGeometry() {
  return new THREE.CylinderGeometry(1, 1, 1, 20, 1).translate(0, 0.5, 0);
}

/** Smoothed copy of the active step; starts below 0 so each scene plays an intro. */
function useStepValue(step: number) {
  const ref = useRef(-1);
  useFrame((_, dt) => {
    ref.current = damp(ref.current, step, 2.4, dt);
  });
  return ref;
}

/** Eases the camera toward a focus point at a given distance. */
function aimCamera(state: RootState, dt: number, look: THREE.Vector3, fx: number, fy: number, dist: number) {
  const cam = state.camera;
  cam.position.x = damp(cam.position.x, fx, 3, dt);
  cam.position.y = damp(cam.position.y, fy, 3, dt);
  cam.position.z = damp(cam.position.z, dist, 3, dt);
  look.set(damp(look.x, fx, 3, dt), damp(look.y, fy, 3, dt), 0);
  cam.lookAt(look);
}

function Turntable({ reduced, children }: { reduced: boolean; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    const g = ref.current;
    if (!g) return;
    const sway = reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.4) * 0.16;
    g.rotation.y = damp(g.rotation.y, sway + state.pointer.x * 0.35, 4, dt);
    g.rotation.x = damp(g.rotation.x, -state.pointer.y * 0.1, 4, dt);
  });
  return <group ref={ref}>{children}</group>;
}

/** Instanced dots travelling along a path, e.g. urine flow or passing fragments. */
function Flow({
  samples,
  count,
  size,
  color,
  sRef,
  amount,
  speed,
  reduced,
}: {
  samples: THREE.Vector3[];
  count: number;
  size: number;
  color: string;
  sRef: RefObject<number>;
  amount: (s: number) => number;
  speed: (s: number) => number;
  reduced: boolean;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const travelRef = useRef(0);
  const offsets = useMemo(() => {
    const rand = seeded(count * 13 + 1);
    return Array.from({ length: count }, () => rand());
  }, [count]);

  useFrame((_, dt) => {
    const mesh = ref.current;
    if (!mesh) return;
    const s = sRef.current;
    const a = amount(s);
    travelRef.current += dt * speed(s) * (reduced ? 0.35 : 1);
    for (let i = 0; i < count; i++) {
      const u = (travelRef.current + offsets[i]) % 1;
      pathAt(samples, u, scratch.position);
      const edge = Math.min(u / 0.08, (1 - u) / 0.08, 1);
      scratch.scale.setScalar(i / count < a ? size * edge : 0);
      scratch.updateMatrix();
      mesh.setMatrixAt(i, scratch.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[1, 10, 10]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </instancedMesh>
  );
}

/** Instanced fragments bursting out from a point as `burst` goes 0 to 1. */
function Burst({
  origin,
  count,
  size,
  color,
  spread,
  sRef,
  burst,
  seed,
}: {
  origin: THREE.Vector3;
  count: number;
  size: number;
  color: string;
  spread: number;
  sRef: RefObject<number>;
  burst: (s: number) => { k: number; life: number };
  seed: number;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dirs = useMemo(() => {
    const rand = seeded(seed);
    return Array.from({ length: count }, () =>
      new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize().multiplyScalar(0.4 + rand()),
    );
  }, [count, seed]);

  useFrame(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const { k, life } = burst(sRef.current);
    for (let i = 0; i < count; i++) {
      scratch.position.copy(origin).addScaledVector(dirs[i], sm(k) * spread);
      scratch.rotation.set(k * 6 + i, k * 4, i);
      scratch.scale.setScalar(k > 0 ? size * life : 0);
      scratch.updateMatrix();
      mesh.setMatrixAt(i, scratch.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={color} roughness={0.6} flatShading />
    </instancedMesh>
  );
}

function tissueProps(color: string, opacity = 1) {
  return {
    color,
    roughness: 0.25,
    clearcoat: 1,
    clearcoatRoughness: 0.15,
    transparent: opacity < 1,
    opacity,
    depthWrite: opacity >= 1,
  };
}

/* ---------- laser stone surgery (ureteroscopy) ---------- */

const URETER: P3[] = [
  [0.4, 1.18, 0],
  [0.3, 0.7, 0.02],
  [0.15, 0.1, 0.04],
  [0, -0.55, 0.02],
  [-0.12, -1.15, 0],
];
const URS_SCOPE: P3[] = [
  [-0.2, -3.2, 0.02],
  [-0.2, -1.95, 0.02],
  [-0.15, -1.35, 0.01],
  [-0.06, -0.85, 0.01],
  [0.05, -0.35, 0.03],
  [0.12, 0.02, 0.04],
];
const SCOPE_T = 96;
const SCOPE_R = 12;

function LaserStage({ step, palette, reduced }: StageProps) {
  const sRef = useStepValue(step);
  const lookRef = useRef(new THREE.Vector3());
  const scopeRef = useRef<THREE.Mesh>(null);
  const tipRef = useRef<THREE.Mesh>(null);
  const beamRef = useRef<THREE.Mesh>(null);
  const stoneRef = useRef<THREE.Mesh>(null);
  const stentRef = useRef<THREE.Mesh>(null);

  const geo = useMemo(() => {
    const samples = samplePath(URS_SCOPE, 64);
    const tip = samples[64];
    const dir = tip.clone().sub(samples[60]).normalize();
    const stone = tip.clone().addScaledVector(dir, 0.16);
    return {
      kidney: createKidneyGeometry(96),
      ureter: createTaperedTube(URETER, 0.075, 0.9, 80, 16),
      urethra: createTaperedTube(
        [
          [-0.2, -1.95, 0],
          [-0.2, -2.6, 0.02],
          [-0.2, -3.2, 0.04],
        ],
        0.05,
        1,
        24,
        12,
      ),
      stent: createTaperedTube(URETER, 0.024, 1, 80, 8),
      scope: createTaperedTube(URS_SCOPE, 0.034, 1, SCOPE_T, SCOPE_R),
      tip,
      stone,
      beamQuat: new THREE.Quaternion().setFromUnitVectors(UP, dir),
      beamPos: tip.clone().addScaledVector(dir, 0.08),
    };
  }, []);

  useFrame((state, dt) => {
    const s = sRef.current;
    const t = state.clock.elapsedTime;
    grow(scopeRef.current, 0.62 * sm(ph(s, -1, 0.2)) + 0.38 * sm(ph(s, 0.3, 1)) - sm(ph(s, 2.3, 3)), SCOPE_T, SCOPE_R);

    const glow = ph(s, 0.8, 1) * (1 - ph(s, 2.3, 2.6));
    fade(tipRef.current, glow * (reduced ? 0.8 : 0.6 + 0.4 * Math.sin(t * 6)));

    const laserOn = s > 1.45 && s < 2.35;
    fade(beamRef.current, laserOn ? (reduced ? 0.8 : Math.sin(t * 40) > 0 ? 0.95 : 0.25) : 0);

    const k = sm(ph(s, 1.6, 2.2));
    if (stoneRef.current) {
      const jitter = laserOn && !reduced ? 1 + Math.sin(t * 50) * 0.04 : 1;
      stoneRef.current.scale.setScalar((1 - k) * jitter);
      stoneRef.current.visible = k < 0.99;
      stoneRef.current.rotation.y += dt * 0.6;
    }
    fade(stentRef.current, ph(s, 2.4, 3));

    const zoom = sm(ph(s, 0.4, 1.2)) * (1 - sm(ph(s, 2.4, 3)));
    aimCamera(state, dt, lookRef.current, geo.stone.x * zoom, 0.25 + geo.stone.y * zoom, 8 - 3 * zoom);
  });

  return (
    <group position={[0, 0.25, 0]}>
      <mesh geometry={geo.kidney} position={[0.55, 1.25, 0]} rotation={[0, 0, 0.25]} scale={0.62}>
        <meshPhysicalMaterial {...tissueProps(palette.tissue)} />
      </mesh>
      <mesh geometry={geo.ureter}>
        <meshPhysicalMaterial {...tissueProps(palette.tissue, 0.35)} />
      </mesh>
      <mesh position={[-0.2, -1.55, 0]} scale={[0.62, 0.46, 0.48]}>
        <sphereGeometry args={[1, 40, 40]} />
        <meshPhysicalMaterial {...tissueProps(palette.neutral, 0.4)} />
      </mesh>
      <mesh geometry={geo.urethra}>
        <meshPhysicalMaterial {...tissueProps(palette.neutral, 0.4)} />
      </mesh>
      <mesh ref={stoneRef} position={geo.stone}>
        <icosahedronGeometry args={[0.11, 0]} />
        <meshStandardMaterial color={palette.stone} roughness={0.55} flatShading />
      </mesh>
      <Burst
        origin={geo.stone}
        count={26}
        size={0.022}
        color={palette.stone}
        spread={0.45}
        sRef={sRef}
        seed={3}
        burst={(s) => ({ k: ph(s, 1.6, 2.4), life: 1 - ph(s, 2.4, 2.9) })}
      />
      <mesh ref={scopeRef} geometry={geo.scope} visible={false}>
        <meshStandardMaterial color={palette.metal} metalness={0.75} roughness={0.25} />
      </mesh>
      <mesh ref={tipRef} position={geo.tip} visible={false}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color={palette.energy} transparent opacity={0} toneMapped={false} />
      </mesh>
      <mesh ref={beamRef} position={geo.beamPos} quaternion={geo.beamQuat} visible={false}>
        <cylinderGeometry args={[0.012, 0.012, 0.16, 8]} />
        <meshBasicMaterial color={palette.energy} transparent opacity={0} toneMapped={false} />
      </mesh>
      <mesh ref={stentRef} geometry={geo.stent} visible={false}>
        <meshStandardMaterial color={palette.metal} transparent opacity={0} roughness={0.4} />
      </mesh>
    </group>
  );
}

/* ---------- PCNL ---------- */

const PCNL_ENTRY: P3 = [2.1, -1.6, -0.7];
const PCNL_TARGET: P3 = [0.12, 0.28, 0];

function PcnlStage({ step, palette, reduced }: StageProps) {
  const sRef = useStepValue(step);
  const lookRef = useRef(new THREE.Vector3());
  const kidneyRef = useRef<THREE.Mesh>(null);
  const probeRef = useRef<THREE.Mesh>(null);
  const portRef = useRef<THREE.Mesh>(null);
  const stoneRef = useRef<THREE.Group>(null);

  const geo = useMemo(() => {
    const { quat, length } = aim(PCNL_ENTRY, PCNL_TARGET);
    return {
      kidney: createKidneyGeometry(96),
      probe: probeGeometry(),
      quat,
      length,
      exit: samplePath([PCNL_TARGET, PCNL_ENTRY], 32),
    };
  }, []);

  useFrame((state, dt) => {
    const s = sRef.current;
    const reach = sm(ph(s, -1, 0.4));
    const radius = THREE.MathUtils.lerp(0.018, 0.11, sm(ph(s, 0.6, 1.3))) - 0.07 * sm(ph(s, 2.4, 3));
    if (probeRef.current) {
      probeRef.current.scale.set(radius, Math.max(0.001, geo.length * reach - 0.12), radius);
      probeRef.current.visible = reach > 0.01;
    }
    fade(portRef.current, ph(s, 0.8, 1.2) * 0.9);
    if (stoneRef.current) {
      const k = sm(ph(s, 1.7, 2.6));
      stoneRef.current.scale.setScalar(Math.max(0.001, 1 - k));
      if (!reduced) stoneRef.current.rotation.y += dt * 0.3;
    }
    fade(kidneyRef.current, 0.42 + 0.25 * ph(s, 2.6, 3));
    aimCamera(state, dt, lookRef.current, 0.4, -0.1, 8.4);
  });

  return (
    <group position={[-0.35, 0.1, 0]}>
      <mesh ref={kidneyRef} geometry={geo.kidney} position={[0, 0.35, 0]} rotation={[0, 0, 0.15]} scale={1.2}>
        <meshPhysicalMaterial {...tissueProps(palette.tissue, 0.42)} />
      </mesh>
      <group ref={stoneRef} position={PCNL_TARGET}>
        <mesh>
          <icosahedronGeometry args={[0.17, 0]} />
          <meshStandardMaterial color={palette.stone} roughness={0.55} flatShading />
        </mesh>
        <mesh position={[0.15, 0.13, 0.02]}>
          <icosahedronGeometry args={[0.11, 0]} />
          <meshStandardMaterial color={palette.stone} roughness={0.55} flatShading />
        </mesh>
        <mesh position={[-0.12, -0.16, 0.04]}>
          <icosahedronGeometry args={[0.1, 0]} />
          <meshStandardMaterial color={palette.stone} roughness={0.55} flatShading />
        </mesh>
      </group>
      <group position={PCNL_ENTRY} quaternion={geo.quat}>
        <mesh ref={probeRef} geometry={geo.probe} visible={false}>
          <meshStandardMaterial color={palette.metal} metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh ref={portRef} rotation={[Math.PI / 2, 0, 0]} visible={false}>
          <torusGeometry args={[0.2, 0.02, 12, 40]} />
          <meshBasicMaterial color={palette.energy} transparent opacity={0} toneMapped={false} />
        </mesh>
      </group>
      <Flow
        samples={geo.exit}
        count={12}
        size={0.05}
        color={palette.stone}
        sRef={sRef}
        reduced={reduced}
        amount={(s) => (s > 1.7 && s < 2.7 ? 1 : 0)}
        speed={() => 0.45}
      />
    </group>
  );
}

/* ---------- ESWL ---------- */

const ESWL_URETER: P3[] = [
  [0.02, 0.55, 0],
  [-0.15, 0, 0.02],
  [-0.3, -0.8, 0],
  [-0.38, -1.6, 0],
  [-0.4, -2.4, 0],
];
const ESWL_STONE = new THREE.Vector3(0.25, 0.32, 0.12);
const RINGS = 4;

function EswlStage({ step, palette, reduced }: StageProps) {
  const sRef = useStepValue(step);
  const lookRef = useRef(new THREE.Vector3());
  const ringsRef = useRef<(THREE.Mesh | null)[]>([]);
  const targetRef = useRef<THREE.Group>(null);
  const shardsRef = useRef<THREE.InstancedMesh>(null);

  const geo = useMemo(() => {
    const rand = seeded(21);
    return {
      kidney: createKidneyGeometry(96),
      ureter: createTaperedTube(ESWL_URETER, 0.065, 0.8, 64, 14),
      path: samplePath(ESWL_URETER, 64),
      shards: Array.from({ length: 9 }, () =>
        new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize().multiplyScalar(0.5 + rand() * 0.5),
      ),
    };
  }, []);

  useFrame((state, dt) => {
    const s = sRef.current;
    const t = state.clock.elapsedTime;

    if (targetRef.current) {
      const on = sm(ph(s, -0.8, 0)) * (1 - ph(s, 1, 1.5));
      targetRef.current.visible = on > 0.01;
      targetRef.current.scale.setScalar(1 + (1 - on) * 0.8);
      targetRef.current.rotation.z = reduced ? 0 : t * 0.6;
    }

    const waves = s > 0.6 && s < 2.3 ? 1 : 0;
    ringsRef.current.forEach((ring, i) => {
      if (!ring) return;
      const u = reduced ? 0.5 : (t * 0.7 + i / RINGS) % 1;
      ring.scale.setScalar(THREE.MathUtils.lerp(1.8, 0.12, u));
      fade(ring, waves * (1 - u) * 0.75);
    });

    const shards = shardsRef.current;
    if (shards) {
      const k = sm(ph(s, 1.5, 2.2));
      const flow = sm(ph(s, 2.5, 3));
      const hit = waves && !reduced ? 1 + Math.sin(t * 22) * 0.05 : 1;
      for (let i = 0; i < geo.shards.length; i++) {
        tmp.copy(ESWL_STONE).addScaledVector(geo.shards[i], 0.035 + k * 0.22);
        if (flow > 0) {
          pathAt(geo.path, (t * 0.12 + i / geo.shards.length) % 1, scratch.position);
          tmp.lerp(scratch.position, flow);
        }
        scratch.position.copy(tmp);
        scratch.rotation.set(i, i * 0.7 + t * 0.3, 0);
        scratch.scale.setScalar((0.085 - k * 0.035) * hit);
        scratch.updateMatrix();
        shards.setMatrixAt(i, scratch.matrix);
      }
      shards.instanceMatrix.needsUpdate = true;
    }
    aimCamera(state, dt, lookRef.current, 0.05, -0.1, 8.2);
  });

  return (
    <group position={[-0.1, 0.25, 0]}>
      <mesh geometry={geo.kidney} position={[0.2, 0.6, 0]} rotation={[0, 0, 0.2]} scale={1.1}>
        <meshPhysicalMaterial {...tissueProps(palette.tissue, 0.45)} />
      </mesh>
      <mesh geometry={geo.ureter}>
        <meshPhysicalMaterial {...tissueProps(palette.tissue, 0.35)} />
      </mesh>
      <instancedMesh ref={shardsRef} args={[undefined, undefined, geo.shards.length]} frustumCulled={false}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={palette.stone} roughness={0.55} flatShading />
      </instancedMesh>
      <group ref={targetRef} position={ESWL_STONE}>
        <mesh>
          <torusGeometry args={[0.42, 0.008, 8, 64]} />
          <meshBasicMaterial color={palette.energy} toneMapped={false} />
        </mesh>
        <mesh>
          <torusGeometry args={[0.28, 0.008, 8, 64, Math.PI * 1.5]} />
          <meshBasicMaterial color={palette.energy} toneMapped={false} />
        </mesh>
      </group>
      {Array.from({ length: RINGS }, (_, i) => (
        <mesh
          key={i}
          ref={(m) => {
            ringsRef.current[i] = m;
          }}
          position={ESWL_STONE}
          visible={false}
        >
          <torusGeometry args={[1, 0.012, 8, 72]} />
          <meshBasicMaterial color={palette.energy} transparent opacity={0} toneMapped={false} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- TURP ---------- */

const TURP_SCOPE: P3[] = [
  [0, -3.3, 0],
  [0, -2.2, 0],
  [0, -1.2, 0],
  [0, -0.15, 0],
];
const PROSTATE_CENTER = new THREE.Vector3(0, -0.4, 0);
const URETHRA_FLOW: P3[] = [
  [0, 0.35, 0],
  [0, -0.4, 0],
  [0, -1.4, 0],
  [0, -2.8, 0],
];

function TurpStage({ step, palette, reduced }: StageProps) {
  const sRef = useStepValue(step);
  const lookRef = useRef(new THREE.Vector3());
  const adenomaRef = useRef<THREE.Mesh>(null);
  const openRef = useRef<THREE.Mesh>(null);
  const scopeRef = useRef<THREE.Mesh>(null);
  const loopRef = useRef<THREE.Mesh>(null);

  const geo = useMemo(
    () => ({
      scope: createTaperedTube(TURP_SCOPE, 0.05, 1, 48, 12),
      urethra: createTaperedTube(
        [
          [0, 0.3, 0],
          [0, -1.2, 0],
          [0, -2.2, 0.02],
          [0, -3.3, 0.04],
        ],
        0.07,
        1,
        48,
        12,
      ),
      flow: samplePath(URETHRA_FLOW, 48),
    }),
    [],
  );

  useFrame((state, dt) => {
    const s = sRef.current;
    const t = state.clock.elapsedTime;
    const cut = sm(ph(s, 1.6, 2.5));
    if (adenomaRef.current) {
      const swell = reduced ? 1 : 1 + 0.03 * Math.sin(t * 2) * (1 - cut);
      adenomaRef.current.scale.setScalar(swell);
      fade(adenomaRef.current, 1 - cut);
    }
    fade(openRef.current, cut);

    grow(scopeRef.current, sm(ph(s, 0.2, 1.1)) - sm(ph(s, 2.4, 3)), 48, 12);
    if (loopRef.current) {
      const on = s > 1.4 && s < 2.5;
      loopRef.current.visible = on;
      loopRef.current.position.y = -0.2 - (reduced ? 0.2 : (Math.sin(t * 3) * 0.5 + 0.5) * 0.35);
    }
    aimCamera(state, dt, lookRef.current, 0, -0.35 + 0.25 * ph(s, 2.5, 3), 8 - 1.4 * sm(ph(s, 0.5, 1.3)) * (1 - ph(s, 2.5, 3)));
  });

  return (
    <group position={[0, 0.5, 0]}>
      <mesh position={[0, 1.05, 0]} scale={[1.05, 0.82, 0.82]}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshPhysicalMaterial {...tissueProps(palette.tissue, 0.4)} />
      </mesh>
      <mesh position={[0, -0.4, 0]} scale={[0.95, 0.78, 0.85]}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshPhysicalMaterial {...tissueProps(palette.neutral, 0.3)} />
      </mesh>
      <mesh ref={adenomaRef} position={[0, -0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.46, 0.36, 24, 48]} />
        <meshPhysicalMaterial {...tissueProps(palette.tissue)} transparent />
      </mesh>
      <mesh ref={openRef} position={[0, -0.4, 0]} rotation={[Math.PI / 2, 0, 0]} visible={false}>
        <torusGeometry args={[0.6, 0.18, 24, 48]} />
        <meshPhysicalMaterial {...tissueProps(palette.tissue)} transparent opacity={0} />
      </mesh>
      <mesh geometry={geo.urethra}>
        <meshPhysicalMaterial {...tissueProps(palette.neutral, 0.45)} />
      </mesh>
      <mesh ref={scopeRef} geometry={geo.scope} visible={false}>
        <meshStandardMaterial color={palette.metal} metalness={0.75} roughness={0.25} />
      </mesh>
      <mesh ref={loopRef} visible={false} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.12, 0.012, 8, 32]} />
        <meshBasicMaterial color={palette.energy} toneMapped={false} />
      </mesh>
      <Burst
        origin={PROSTATE_CENTER}
        count={18}
        size={0.03}
        color={palette.tissue}
        spread={0.9}
        sRef={sRef}
        seed={8}
        burst={(s) => ({ k: ph(s, 1.6, 2.6), life: 1 - ph(s, 2.4, 2.8) })}
      />
      <Flow
        samples={geo.flow}
        count={16}
        size={0.045}
        color={palette.energy}
        sRef={sRef}
        reduced={reduced}
        amount={(s) => 0.25 + 0.75 * ph(s, 2.4, 3)}
        speed={(s) => 0.12 + 0.45 * ph(s, 2.4, 3)}
      />
    </group>
  );
}

/* ---------- laparoscopic kidney surgery ---------- */

const KIDNEY_CENTER: P3 = [0, 0, 0];
const PORTS: P3[] = [
  [-1.5, 1.5, 1.8],
  [0.3, 1.9, 1.9],
  [1.6, 1.1, 1.7],
  [-0.4, -1.7, 2.0],
];

function LapStage({ step, palette, reduced }: StageProps) {
  const sRef = useStepValue(step);
  const lookRef = useRef(new THREE.Vector3());
  const portsRef = useRef<(THREE.Group | null)[]>([]);
  const toolsRef = useRef<(THREE.Mesh | null)[]>([]);
  const organRef = useRef<THREE.Group>(null);
  const bagRef = useRef<THREE.Mesh>(null);
  const clipsRef = useRef<THREE.Group>(null);

  const geo = useMemo(
    () => ({
      kidney: createKidneyGeometry(96),
      probe: probeGeometry(),
      ports: PORTS.map((p) => aim(p, KIDNEY_CENTER)),
      artery: createTaperedTube(
        [
          [-0.22, 0.02, 0],
          [-0.7, 0.08, -0.08],
          [-1.4, 0.1, -0.15],
        ],
        0.06,
        1,
        32,
        12,
      ),
      vein: createTaperedTube(
        [
          [-0.22, -0.14, 0.04],
          [-0.75, -0.18, 0],
          [-1.4, -0.22, -0.08],
        ],
        0.075,
        1,
        32,
        12,
      ),
      ureter: createTaperedTube(
        [
          [-0.22, -0.25, 0],
          [-0.35, -1, 0],
          [-0.4, -2.4, 0],
        ],
        0.05,
        1,
        32,
        12,
      ),
    }),
    [],
  );

  useFrame((state, dt) => {
    const s = sRef.current;
    const t = state.clock.elapsedTime;
    const close = sm(ph(s, 2.75, 3));
    portsRef.current.forEach((g, i) => {
      if (!g) return;
      const k = sm(ph(s, -1 + i * 0.2, 0 + i * 0.2)) * (1 - close);
      g.scale.setScalar(Math.max(0.001, k));
    });
    const reach = sm(ph(s, 0.5, 1.2)) * (1 - sm(ph(s, 2.4, 2.8)));
    toolsRef.current.forEach((m, i) => {
      if (!m) return;
      const len = geo.ports[i].length - 1.05;
      const wiggle = reduced ? 0 : Math.sin(t * 2 + i) * 0.05;
      m.scale.set(0.02, Math.max(0.001, len * reach + wiggle * reach), 0.02);
      m.visible = reach > 0.01;
    });
    if (clipsRef.current) clipsRef.current.visible = s > 1.6;
    fade(bagRef.current, sm(ph(s, 2.1, 2.4)) * 0.3 * (1 - sm(ph(s, 2.7, 3))));
    if (organRef.current) {
      const out = sm(ph(s, 2.3, 3));
      organRef.current.position.set(out * 0.3, out * 1.6, out * 1.6);
      organRef.current.scale.setScalar(Math.max(0.001, 1 - out * 0.85));
    }
    aimCamera(state, dt, lookRef.current, 0, 0, 8.6);
  });

  return (
    <group position={[0.2, 0.1, 0]}>
      <mesh geometry={geo.artery}>
        <meshPhysicalMaterial {...tissueProps(palette.tissue)} />
      </mesh>
      <mesh geometry={geo.vein}>
        <meshPhysicalMaterial {...tissueProps(palette.vein)} />
      </mesh>
      <mesh geometry={geo.ureter}>
        <meshPhysicalMaterial {...tissueProps(palette.neutral, 0.6)} />
      </mesh>
      <group ref={clipsRef} visible={false}>
        {[
          [-0.55, 0.07, -0.05],
          [-0.62, -0.17, 0.02],
          [-0.33, -0.7, 0],
        ].map((p, i) => (
          <mesh key={i} position={p as P3}>
            <boxGeometry args={[0.05, 0.2, 0.05]} />
            <meshStandardMaterial color={palette.metal} metalness={0.8} roughness={0.25} />
          </mesh>
        ))}
      </group>
      <group ref={organRef}>
        <mesh geometry={geo.kidney} rotation={[0, 0, 0.2]} scale={1.05}>
          <meshPhysicalMaterial {...tissueProps(palette.tissue)} />
        </mesh>
        <mesh position={[0.32, 0.62, 0.18]}>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshPhysicalMaterial {...tissueProps(palette.tumour)} />
        </mesh>
        <mesh ref={bagRef} scale={[1.05, 1.35, 0.8]} visible={false}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshPhysicalMaterial color={palette.neutral} transparent opacity={0} roughness={0.1} depthWrite={false} />
        </mesh>
      </group>
      {PORTS.map((p, i) => (
        <group
          key={i}
          ref={(g) => {
            portsRef.current[i] = g;
          }}
          position={p}
          quaternion={geo.ports[i].quat}
          scale={0.001}
        >
          <mesh geometry={geo.probe} scale={[0.08, 0.5, 0.08]}>
            <meshStandardMaterial color={palette.metal} metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.11, 0.025, 10, 32]} />
            <meshStandardMaterial color={i === 3 ? palette.energy : palette.metal} metalness={0.5} roughness={0.3} />
          </mesh>
          <mesh
            ref={(m) => {
              toolsRef.current[i] = m;
            }}
            geometry={geo.probe}
            position={[0, 0.5, 0]}
            visible={false}
          >
            <meshStandardMaterial color={palette.metal} metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ---------- varicocele microsurgery ---------- */

function veinPath(x: number, z: number, phase: number): P3[] {
  return Array.from({ length: 14 }, (_, j) => {
    const y = -0.45 + j * 0.2;
    return [x + 0.11 * Math.sin(y * 4.2 + phase), y, z + 0.1 * Math.cos(y * 3.4 + phase)];
  });
}

const VEINS = [
  { x: -0.3, z: 0.05, phase: 0 },
  { x: 0.28, z: 0.1, phase: 1.7 },
  { x: -0.08, z: 0.28, phase: 3.1 },
  { x: 0.12, z: -0.22, phase: 4.4 },
];
const ARTERY: P3[] = [
  [0.02, -0.5, 0.02],
  [0.05, 0.6, 0.0],
  [0.0, 1.6, 0.02],
  [0.04, 2.3, 0],
];
const HEALTHY_VEIN: P3[] = [
  [-0.16, -0.5, -0.12],
  [-0.2, 0.7, -0.14],
  [-0.16, 2.3, -0.1],
];
const TIE_Y = 1.15;

function VaricoceleStage({ step, palette, reduced }: StageProps) {
  const sRef = useStepValue(step);
  const lookRef = useRef(new THREE.Vector3());
  const veinsRef = useRef<(THREE.Mesh | null)[]>([]);
  const tiesRef = useRef<THREE.Group>(null);
  const lensRef = useRef<THREE.Group>(null);

  const geo = useMemo(
    () => ({
      veins: VEINS.map((v) => createTaperedTube(veinPath(v.x, v.z, v.phase), 0.075, 0.85, 96, 12)),
      ties: VEINS.map((v) => veinPath(v.x, v.z, v.phase)[8]),
      artery: createTaperedTube(ARTERY, 0.035, 1, 48, 10),
      healthy: createTaperedTube(HEALTHY_VEIN, 0.04, 1, 48, 10),
      vas: createTaperedTube(
        [
          [0.36, -0.6, -0.1],
          [0.42, 0.8, -0.12],
          [0.4, 2.3, -0.1],
        ],
        0.035,
        1,
        48,
        10,
      ),
      arteryFlow: samplePath([...ARTERY].reverse(), 48),
      veinFlow: samplePath(HEALTHY_VEIN, 48),
    }),
    [],
  );

  useFrame((state, dt) => {
    const s = sRef.current;
    const t = state.clock.elapsedTime;
    const tied = sm(ph(s, 1.8, 2.5));
    veinsRef.current.forEach((m, i) => {
      if (!m) return;
      const mat = m.material as THREE.MeshPhysicalMaterial;
      mat.opacity = 1 - tied * 0.82;
      mat.depthWrite = mat.opacity > 0.9;
      const pulse = reduced ? 0 : Math.max(0, Math.sin(t * 2.4 + i)) * 0.25;
      mat.emissiveIntensity = (1 - ph(s, 0.8, 1.6)) * pulse;
    });
    if (tiesRef.current) {
      const k = sm(ph(s, 1.6, 2.1));
      tiesRef.current.visible = k > 0.01;
      tiesRef.current.scale.setScalar(Math.max(0.001, k));
    }
    if (lensRef.current) {
      const on = sm(ph(s, 0.4, 1.1)) * (1 - sm(ph(s, 2.3, 2.9)));
      lensRef.current.visible = on > 0.01;
      lensRef.current.scale.setScalar(0.6 + on * 0.4);
    }
    const zoom = sm(ph(s, 0.5, 1.2)) * (1 - sm(ph(s, 2.5, 3)));
    aimCamera(state, dt, lookRef.current, 0, 0.35 + zoom * 0.7, 8.2 - zoom * 2.6);
  });

  return (
    <group position={[0, -0.25, 0]}>
      <mesh position={[0, -1.25, 0]} scale={[0.62, 0.8, 0.56]}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshPhysicalMaterial {...tissueProps(palette.neutral)} />
      </mesh>
      <mesh geometry={geo.artery}>
        <meshPhysicalMaterial {...tissueProps(palette.tissue)} />
      </mesh>
      <mesh geometry={geo.vas}>
        <meshPhysicalMaterial {...tissueProps(palette.neutral)} />
      </mesh>
      <mesh geometry={geo.healthy}>
        <meshPhysicalMaterial {...tissueProps(palette.vein)} />
      </mesh>
      {geo.veins.map((g, i) => (
        <mesh
          key={i}
          geometry={g}
          ref={(m) => {
            veinsRef.current[i] = m;
          }}
        >
          <meshPhysicalMaterial {...tissueProps(palette.vein)} transparent emissive={palette.vein} />
        </mesh>
      ))}
      <group ref={tiesRef} visible={false}>
        {geo.ties.map((p, i) => (
          <mesh key={i} position={[p[0], TIE_Y, p[2]]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.1, 0.02, 10, 32]} />
            <meshStandardMaterial color={palette.metal} metalness={0.6} roughness={0.3} />
          </mesh>
        ))}
      </group>
      <group ref={lensRef} position={[0, 1.05, 1.6]} visible={false}>
        <mesh>
          <torusGeometry args={[0.78, 0.022, 12, 72]} />
          <meshStandardMaterial color={palette.metal} metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh>
          <circleGeometry args={[0.76, 64]} />
          <meshBasicMaterial color={palette.energy} transparent opacity={0.07} depthWrite={false} />
        </mesh>
      </group>
      <Flow
        samples={geo.arteryFlow}
        count={10}
        size={0.03}
        color={palette.energy}
        sRef={sRef}
        reduced={reduced}
        amount={(s) => ph(s, 2.4, 2.9)}
        speed={() => 0.35}
      />
      <Flow
        samples={geo.veinFlow}
        count={10}
        size={0.03}
        color={palette.energy}
        sRef={sRef}
        reduced={reduced}
        amount={(s) => ph(s, 2.5, 3)}
        speed={() => 0.3}
      />
    </group>
  );
}
