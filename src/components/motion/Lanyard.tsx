/* eslint-disable react/no-unknown-property */
'use client';
import { useEffect, useRef, useState, Component, type ReactNode, Suspense } from 'react';
import { Canvas, extend, useFrame, type ThreeElement, type ThreeEvent } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
  type RigidBodyProps
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';
import { useInViewport } from '@/hooks/use-in-viewport';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

extend({ MeshLineGeometry, MeshLineMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
    meshLineMaterial: ThreeElement<typeof MeshLineMaterial>;
  }
}

// ── Error boundary: catches WebGL/asset crashes silently ──────────────────
class CanvasErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: { componentStack?: string | null }) {
    // The canvas renders nothing rather than a white-box crash when this fires -- log
    // loudly so a silent "the lanyard just isn't there" report has a stack trace behind it
    // instead of nothing, unlike every attempt so far to reproduce that report.
    console.error('[Lanyard] Canvas crashed and was hidden:', error, info.componentStack);
  }
  render() {
    if (this.state.failed) return null; // show nothing instead of white box
    return this.props.children;
  }
}

const CARD_GLB = '/assets/lanyard/card.glb';
const LANYARD_PNG = '/assets/lanyard/lanyard.png';

// Preload outside component so it fires once per module load. Importing this module at all
// (even without rendering <Lanyard />, e.g. AboutIntro's idle-time prefetch) is enough to
// trigger both -- the GLB and the texture were previously only requested once the component
// actually mounted, which measured ~1s after scrolling into position (texture alone took
// ~1.4s over the network in one test) because nothing about them started loading until then.
if (typeof window !== 'undefined') {
  useGLTF.preload(CARD_GLB);
  useTexture.preload(LANYARD_PNG);
}

interface LanyardProps {
  transparent?: boolean;
  className?: string;
}

export default function Lanyard({
  transparent = true,
  className = '',
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState<boolean>(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );
  const wrapperRef = useRef<HTMLDivElement>(null);
  // Match AboutIntro's own 600px mount-gate margin (default is 200px). Lanyard only ever
  // mounts once AboutIntro's own check already confirmed it's within 600px of the viewport --
  // if this component's own check used a tighter margin, there was a real window where the
  // canvas was mounted but this hook's freshly-created IntersectionObserver hadn't yet fired
  // its first callback for the (still out of its narrower range) element, leaving frameloop
  // stuck on 'never' for up to ~1s after mount even with no further scrolling. Matching the
  // margin means this check is already satisfied the instant it mounts.
  const inView = useInViewport(wrapperRef, { rootMargin: '600px' });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const handleResize = (): void => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const camPos: [number, number, number] = isMobile ? [0, 0, 10] : [0, 0, 13];
  const camFov = isMobile ? 32 : 26;
  const gravity: [number, number, number] = [0, -40, 0];

  return (
    <div
      ref={wrapperRef}
      className={`relative z-0 w-full pointer-events-none [&_canvas]:pointer-events-auto ${className}`}
      style={{ height: isMobile ? '480px' : '560px' }}
    >
      <CanvasErrorBoundary>
        <Canvas
          frameloop={inView && !reducedMotion ? 'always' : 'never'}
          camera={{ position: camPos, fov: camFov }}
          dpr={[1, isMobile ? 1.5 : 2]}
          gl={{ alpha: transparent }}
          onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
        >
          <ambientLight intensity={Math.PI} />
          <Suspense fallback={null}>
            <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
              <Band isMobile={isMobile} />
            </Physics>
            {/* PMREMGenerator (used internally by <Environment>) is a well-documented source of a
                benign "X4122 sum of 1 and [tiny epsilon] cannot be represented accurately" shader
                compiler warning on some GPU/driver combinations -- a cosmetic Three.js/PMREM
                artifact that doesn't affect rendered output. It didn't reproduce in this session's
                automated test browser (no console entry via the JS console API or the CDP Log
                domain, on a real hardware-accelerated ANGLE/D3D11 NVIDIA backend, with or without
                this block present), so a local before/after repro wasn't possible here; the
                attribution to PMREMGenerator is based on the warning's known signature and prior
                confirmation (via git history) that it already existed before any work this session,
                not a fresh local reproduction. Not something to "fix" by patching library internals
                -- doing so would risk silencing real warnings too. */}
            <Environment blur={0.75}>
              <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
              <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
              <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
              <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
            </Environment>
          </Suspense>
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
  gravity?: [number, number, number];
}

type LanyardRigidBody = RapierRigidBody & { lerped?: THREE.Vector3 };

function Band({ maxSpeed = 50, minSpeed = 0, isMobile = false }: BandProps) {
  const band = useRef<THREE.Mesh<
    InstanceType<typeof MeshLineGeometry>,
    InstanceType<typeof MeshLineMaterial>
  >>(null!);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<LanyardRigidBody>(null!);
  const j2 = useRef<LanyardRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const cardQuat = new THREE.Quaternion();
  const clipWorld = new THREE.Vector3();
  const hasLoggedFrameCrash = useRef(false);
  const hasLoggedAnchorGap = useRef(false);

  const segmentProps: RigidBodyProps = {
    type: 'dynamic',
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4,
  };

  const getLerped = (body: LanyardRigidBody): THREE.Vector3 => {
    const real = body.translation();
    if (!body.lerped) {
      body.lerped = new THREE.Vector3().copy(real);
    } else if (body.lerped.distanceTo(real as unknown as THREE.Vector3) > 50) {
      // The cache can end up far from reality if this was first read before Rapier's
      // WASM-backed rigid body was fully valid -- rather than slowly lerping in from
      // garbage over dozens of frames (which is what produced the huge card-anchor/rope
      // gaps the Band useFrame clamp logs), snap back when the divergence is implausible
      // for this scene's scale (everything here lives within single-digit units).
      body.lerped.copy(real);
    }
    return body.lerped;
  };

  // These are loaded inside <Suspense> so they can suspend safely
  const { nodes, materials } = useGLTF(CARD_GLB) as any;
  const texture = useTexture(LANYARD_PNG);

  const [curve] = useState(
    () => new THREE.CatmullRomCurve3([
      new THREE.Vector3(), new THREE.Vector3(),
      new THREE.Vector3(), new THREE.Vector3(),
    ])
  );
  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  // The card-side anchor point for the rope's spherical joint. Named so the joint below
  // and the band's render-time endpoint in useFrame read from the same value and can
  // never drift apart -- the band always terminates exactly at this rigidly-attached
  // anchor, regardless of where the visual clip mesh is positioned relative to it.
  const CARD_CLIP_OFFSET: [number, number, number] = [0, 1.45, 0];

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], CARD_CLIP_OFFSET]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => { document.body.style.cursor = 'auto'; };
    }
  }, [hovered, dragged]);

  const runBandFrame = (state: Parameters<Parameters<typeof useFrame>[0]>[0], delta: number) => {
    if (dragged && typeof dragged !== 'boolean') {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(r => r.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }
    if (fixed.current) {
      [j1, j2].forEach(ref => {
        const lerped = getLerped(ref.current);
        const dist = Math.max(0.1, Math.min(1, lerped.distanceTo(ref.current.translation())));
        lerped.lerp(ref.current.translation(), delta * (minSpeed + dist * (maxSpeed - minSpeed)));
      });
      const cardRotation = card.current.rotation();
      cardQuat.set(cardRotation.x, cardRotation.y, cardRotation.z, cardRotation.w);
      clipWorld.set(...CARD_CLIP_OFFSET).applyQuaternion(cardQuat).add(card.current.translation() as unknown as THREE.Vector3);
      curve.points[0].copy(clipWorld);
      curve.points[1].copy(getLerped(j2.current));
      curve.points[2].copy(getLerped(j1.current));
      curve.points[3].copy(fixed.current.translation());

      // curve.points[1] is j2's deliberately-lagging smoothed position (getLerped), not its
      // real rope-constrained one -- exceeding a rope segment's natural length here during
      // fast motion is expected smoothing lag, not necessarily a bug. So the warning below
      // checks j2's REAL (unlerped) position against the card anchor instead: the rope joints
      // (useRopeJoint calls above) constrain that real position to 1 unit, so exceeding it
      // there is genuine evidence of the card diverging from the rope-physics chain. The
      // clamp, separately, always operates on the rendered gap (points[0] to points[1]),
      // since a visual kink is a kink regardless of whether it's smoothing lag or a real bug.
      const MAX_SEGMENT_GAP = 1;
      const realAnchorGap = clipWorld.distanceTo(j2.current.translation() as unknown as THREE.Vector3);
      if (realAnchorGap > MAX_SEGMENT_GAP && process.env.NODE_ENV !== 'production' && !hasLoggedAnchorGap.current) {
        hasLoggedAnchorGap.current = true;
        console.warn(
          `[Lanyard] card-anchor/j2 real-position gap ${realAnchorGap.toFixed(2)} exceeded ${MAX_SEGMENT_GAP}. ` +
          'This means the card diverged from the rope-physics chain by more than a rope segment ' +
          'can naturally stretch -- concrete evidence for investigating why (e.g. log cardRotation ' +
          'and the rope bodies\' positions at this moment). Logged once per mount to avoid spam.'
        );
      }
      const renderGap = curve.points[0].distanceTo(curve.points[1]);
      if (renderGap > MAX_SEGMENT_GAP) {
        curve.points[1].lerp(curve.points[0], 1 - MAX_SEGMENT_GAP / renderGap);
      }

      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
      ang.copy(card.current.angvel());
      rot.copy(cardRotation);
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
    }
  };

  useFrame((state, delta) => {
    // R3F invokes useFrame callbacks from its own render loop, outside React's
    // render/commit cycle -- an uncaught throw here does NOT reach CanvasErrorBoundary's
    // componentDidCatch (confirmed: React error boundaries only catch render-phase errors).
    // Nearly all of this component's actual logic runs in this callback, so without this
    // try/catch, a bug here would surface only as an uncaught pageerror at best, or a
    // silently frozen/broken canvas at worst -- exactly the "the lanyard just isn't there"
    // shape of bug reported and never reproduced. Logging here, not just at the React
    // error boundary, covers the code path where the real logic actually runs.
    try {
      runBandFrame(state, delta);
    } catch (error) {
      // If the failure persists (e.g. a NaN propagating through physics state every tick),
      // this would otherwise log up to 60x/sec forever -- report only the first occurrence
      // per mount so the one useful stack trace doesn't get buried under a duplicate flood.
      if (!hasLoggedFrameCrash.current) {
        hasLoggedFrameCrash.current = true;
        console.error('[Lanyard] useFrame threw and was caught to avoid breaking the render loop:', error);
      }
    }
  });

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  if (!nodes || !materials) return null;

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.9}
            position={[0, -1.45, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: ThreeEvent<PointerEvent>) => {
              (e.target as Element).releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e: ThreeEvent<PointerEvent>) => {
              (e.target as Element).setPointerCapture(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
            }}
          >
            <mesh geometry={nodes.card?.geometry}>
              <meshPhysicalMaterial
                map={materials.base?.map}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
            <mesh geometry={nodes.clip?.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp?.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          args={[{
            color: new THREE.Color('white'),
            resolution: isMobile ? new THREE.Vector2(1000, 2000) : new THREE.Vector2(1000, 1000),
            useMap: 1,
            map: texture,
            repeat: new THREE.Vector2(-4, 1),
            lineWidth: 1,
          }]}
        />
      </mesh>
    </>
  );
}
