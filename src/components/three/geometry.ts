import * as THREE from "three";

/**
 * Procedural kidney: a sphere squashed into an ellipsoid, bent so both poles
 * lean medially, with a hilum indentation on the -X (medial) side.
 */
export function createKidneyGeometry(segments = 96) {
  const geo = new THREE.SphereGeometry(1, segments, segments);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const medial = Math.max(0, -v.x);
    const band = Math.exp(-(v.y * v.y) / 0.085);

    let x = v.x * 0.62;
    const y = v.y;
    let z = v.z * 0.42;

    x += band * medial * medial * 0.4;
    x -= 0.12 * v.y * v.y;
    z *= 1 - band * medial * 0.3;

    pos.setXYZ(i, x, y, z);
  }

  geo.computeVertexNormals();
  return geo;
}

/** Point on the kidney surface where the renal pelvis and ureter leave. */
export const HILUM = new THREE.Vector3(-0.22, -0.02, 0);

/** Tube that narrows from `radius` to `radius * endScale` along its length. */
export function createTaperedTube(
  points: [number, number, number][],
  radius: number,
  endScale = 0.35,
  tubular = 96,
  radial = 18,
) {
  return createProfiledTube(points, (t) => radius * THREE.MathUtils.lerp(1, endScale, t * t), tubular, radial);
}

/** Tube whose radius at each point along it (t from 0 to 1) comes from `profile`. */
export function createProfiledTube(
  points: [number, number, number][],
  profile: (t: number) => number,
  tubular = 96,
  radial = 18,
) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
  const geo = new THREE.TubeGeometry(curve, tubular, 1, radial, false);
  const pos = geo.attributes.position;
  const center = new THREE.Vector3();
  const v = new THREE.Vector3();

  for (let i = 0; i <= tubular; i++) {
    const t = i / tubular;
    curve.getPointAt(t, center);
    const r = profile(t);
    for (let j = 0; j <= radial; j++) {
      const idx = i * (radial + 1) + j;
      v.fromBufferAttribute(pos, idx).sub(center).multiplyScalar(r).add(center);
      pos.setXYZ(idx, v.x, v.y, v.z);
    }
  }

  geo.computeVertexNormals();
  return geo;
}
