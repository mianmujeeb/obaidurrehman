"use client";

import { Environment, Lightformer } from "@react-three/drei";

/**
 * Procedural studio lighting baked into an environment map once.
 * No HDR download, so the scenes still light correctly offline.
 */
export function Studio({ dark }: { dark: boolean }) {
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer form="rect" intensity={dark ? 2 : 3} position={[0, 5, 2]} scale={[10, 3, 1]} />
      <Lightformer
        form="ring"
        intensity={dark ? 2.2 : 1.4}
        color="#7fe3d8"
        position={[-5, 1, 3]}
        scale={3}
        onUpdate={(self) => self.lookAt(0, 0, 0)}
      />
      <Lightformer form="rect" intensity={1.4} position={[5, -1, 2]} scale={[2, 8, 1]} />
      <Lightformer form="circle" intensity={dark ? 0.6 : 1} position={[0, -5, -3]} scale={6} />
    </Environment>
  );
}

export type DragState = {
  active: boolean;
  yaw: number;
  velocity: number;
  lastX: number;
  lastT: number;
};

export function createDragState(): DragState {
  return { active: false, yaw: 0, velocity: 0, lastX: 0, lastT: 0 };
}

/**
 * Horizontal drag-to-rotate on a DOM wrapper. Vertical swipes still scroll the
 * page because the canvas uses touch-action: pan-y.
 */
export function startDrag(state: DragState, e: React.PointerEvent) {
  if (e.button !== 0) return;
  state.active = true;
  state.velocity = 0;
  state.lastX = e.clientX;
  state.lastT = performance.now();

  const move = (ev: PointerEvent) => {
    const now = performance.now();
    const dx = (ev.clientX - state.lastX) * 0.008;
    const dt = Math.max(16, now - state.lastT) / 1000;
    state.yaw += dx;
    state.velocity = clamp(dx / dt, -6, 6);
    state.lastX = ev.clientX;
    state.lastT = now;
  };
  const end = () => {
    state.active = false;
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", end);
    window.removeEventListener("pointercancel", end);
  };

  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", end);
  window.addEventListener("pointercancel", end);
}

/** Decays drag velocity into yaw after release (call once per frame). */
export function stepDrag(state: DragState, dt: number) {
  if (state.active) return;
  state.velocity *= Math.pow(0.03, dt);
  state.yaw += state.velocity * dt;
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}
