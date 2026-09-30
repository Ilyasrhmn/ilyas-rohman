"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";

// Ported from Shader-Transition/components/PageTransition.tsx. The shader's
// wave/noise math and colors are deliberately kept identical to the reference.
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uProgress;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = p * 2.0 + vec2(13.7, 9.1);
      a *= 0.5;
    }
    return v;
  }
  void main() {
    vec2 p = vUv * 3.0;
    float t = uProgress * 3.14;
    vec2 warp = vec2(
      fbm(p + vec2(0.0, t * 0.2)),
      fbm(p + vec2(5.2, 1.3) - vec2(t * 0.15, 0.0))
    );
    float w = fbm(p + 0.9 * warp);
    float waves = sin(vUv.x * 6.0 + t) * 0.03 + sin(vUv.x * 13.0 - t) * 0.012;
    float wipe = vUv.y + (w - 0.5) * 0.3 + waves;
    float coverP = smoothstep(0.0, 0.55, uProgress);
    float clearP = smoothstep(0.45, 1.0, uProgress);
    float frontPos = coverP * 2.2 - 0.35;
    float backPos = clearP * 2.2 - 0.35;
    float covered = smoothstep(wipe - 0.1, wipe + 0.1, frontPos);
    float cleared = smoothstep(wipe - 0.1, wipe + 0.1, backPos);
    float band = covered - cleared;
    float dEdge = min(frontPos - wipe, wipe - backPos);
    float body = smoothstep(0.05, 0.6, dEdge);
    float hide = 1.0 - smoothstep(0.08, 0.18, abs(uProgress - 0.5));
    float alpha = band * mix(0.3, 1.0, max(body, hide));
    float tint = clamp(1.0 - body + (w - 0.5) * 0.4, 0.0, 1.0);
    vec3 color = mix(uColorA, uColorB, tint);
    color += 0.03 * vec3(sin(w * 8.0 + t), sin(w * 8.0 + t + 2.1), sin(w * 8.0 + t + 4.2));
    float frontGlow = 1.0 - smoothstep(0.0, 0.25, abs(frontPos - wipe));
    float backGlow = 1.0 - smoothstep(0.0, 0.25, abs(backPos - wipe));
    color += (frontGlow + backGlow) * 0.12;
    gl_FragColor = vec4(color, alpha);
  }
`;

function Plane({
  progress,
  invalidateRef,
}: {
  progress: MutableRefObject<{ value: number }>;
  invalidateRef: MutableRefObject<(() => void) | null>;
}) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const invalidate = useThree((state) => state.invalidate);
  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uColorA: { value: new THREE.Color("#0f766e") },
      uColorB: { value: new THREE.Color("#99f6e4") },
    }),
    []
  );

  useEffect(() => {
    invalidateRef.current = invalidate;
    return () => {
      invalidateRef.current = null;
    };
  }, [invalidate, invalidateRef]);

  useFrame(() => {
    if (material.current) material.current.uniforms.uProgress.value = progress.current.value;
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}

export function ShaderTransition({
  progress,
  invalidateRef,
}: {
  progress: MutableRefObject<{ value: number }>;
  invalidateRef: MutableRefObject<(() => void) | null>;
}) {
  return (
    <Canvas
      aria-hidden
      frameloop="demand"
      gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
      style={{ position: "fixed", inset: 0, zIndex: 300, pointerEvents: "none" }}
      onCreated={({ gl }) => {
        gl.domElement.style.pointerEvents = "none";
      }}
    >
      <Plane progress={progress} invalidateRef={invalidateRef} />
    </Canvas>
  );
}
