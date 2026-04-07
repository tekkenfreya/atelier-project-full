"use client";

import { useRef, useMemo, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

/* ─── Floating particles (static backdrop, very slow rotation) ─── */

function Particles({ count = 60 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return pos;
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.008;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.018}
        color="#c4b67a"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ─── Orb color palette ─── */

const ORB_COLORS = [
  { color: "#a3c4b8", emissive: "#7aaa96", core: "#d4ece4" },
  { color: "#c4b67a", emissive: "#a89a5c", core: "#ede5c4" },
  { color: "#b8a3c4", emissive: "#9a7aaa", core: "#e0d4ec" },
  { color: "#c4a3a3", emissive: "#aa7a7a", core: "#ecd4d4" },
  { color: "#a3b8c4", emissive: "#7a96aa", core: "#d4e0ec" },
  { color: "#b8c4a3", emissive: "#96aa7a", core: "#e0ecd4" },
];

/* ─── Shapes — each botanical gets a shape based on its index ─── */

const SHAPES = ["sphere", "octahedron", "dodecahedron", "torus", "icosahedron"] as const;
type ShapeName = typeof SHAPES[number];

function ShapeGeometry({ shape }: { shape: string }) {
  switch (shape) {
    case "octahedron":
      return <octahedronGeometry args={[0.42, 0]} />;
    case "dodecahedron":
      return <dodecahedronGeometry args={[0.45, 0]} />;
    case "torus":
      return <torusGeometry args={[0.32, 0.14, 16, 32]} />;
    case "icosahedron":
      return <icosahedronGeometry args={[0.4, 0]} />;
    default:
      return <sphereGeometry args={[0.4, 32, 32]} />;
  }
}

/* ─── Single botanical shape ─── */

interface BotanicalOrbProps {
  name: string;
  scientificName?: string;
  targetX: number;
  colorIndex: number;
  isCenter: boolean;
  imagePath?: string;
}

function BotanicalOrb({ name, scientificName, targetX, colorIndex, isCenter, imagePath }: BotanicalOrbProps) {
  const groupRef = useRef<THREE.Group>(null);
  const orbRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const initialized = useRef(false);

  const palette = ORB_COLORS[colorIndex % ORB_COLORS.length];
  const shape = SHAPES[colorIndex % SHAPES.length];

  useFrame(({ clock }) => {
    if (!groupRef.current || !orbRef.current) return;

    /* On first frame, snap to position and scale instantly */
    if (!initialized.current) {
      initialized.current = true;
      groupRef.current.position.x = targetX;
      const initScale = isCenter ? 0.95 : 0.65;
      orbRef.current.scale.setScalar(initScale);
      return;
    }

    /* Slide to target X position */
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.09);

    /* Gentle Y float — center only */
    const floatY = isCenter ? Math.sin(clock.getElapsedTime() * 1.2) * 0.04 : 0;
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, floatY, 0.05);

    /* Slow rotation — each shape rotates slightly */
    orbRef.current.rotation.y += 0.003;
    orbRef.current.rotation.x += 0.001;

    /* Scale */
    const targetScale = isCenter ? 0.95 : 0.65;
    orbRef.current.scale.setScalar(THREE.MathUtils.lerp(orbRef.current.scale.x, targetScale, 0.08));

    /* Material */
    const mat = orbRef.current.material as THREE.MeshPhysicalMaterial;
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, isCenter ? 0.9 : 0.4, 0.07);
    mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, isCenter ? 0.45 : 0.06, 0.07);

    /* Selection glow halo */
    if (glowRef.current) {
      const glowMat = glowRef.current.material as THREE.MeshBasicMaterial;
      const targetOpacity = isCenter
        ? 0.25 + Math.sin(clock.getElapsedTime() * 1.5) * 0.08
        : 0;
      glowMat.opacity = THREE.MathUtils.lerp(glowMat.opacity, targetOpacity, 0.07);

      const targetGlowScale = isCenter
        ? 1.8 + Math.sin(clock.getElapsedTime() * 1.0) * 0.1
        : 0.8;
      glowRef.current.scale.setScalar(THREE.MathUtils.lerp(glowRef.current.scale.x, targetGlowScale, 0.06));
    }
  });

  return (
    <group ref={groupRef} position={[targetX, 0, 0]}>
      {/* Selection glow */}
      <mesh ref={glowRef} scale={0.8}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial
          color={palette.emissive}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Shape */}
      <mesh ref={orbRef}>
        <ShapeGeometry shape={shape} />
        <meshPhysicalMaterial
          color={palette.core}
          transparent
          opacity={0.7}
          roughness={0.12}
          metalness={0.05}
          clearcoat={0.9}
          clearcoatRoughness={0.06}
          emissive={palette.emissive}
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Label — center only */}
      {isCenter && (
        <Html center position={[0, -0.9, 0]} style={{ pointerEvents: "none" }}>
          <div className="rd-orb-label">
            <span className="rd-orb-label-name">{name}</span>
            {scientificName && <span className="rd-orb-label-sci">{scientificName}</span>}
          </div>
        </Html>
      )}
    </group>
  );
}

/* ─── Main scene ─── */

export interface BotanicalItem {
  id: string;
  name: string;
  scientificName?: string;
  imagePath?: string;
}

interface ProductSceneProps {
  botanicals: BotanicalItem[];
}

export default function ProductScene({ botanicals }: ProductSceneProps) {
  const [centerIndex, setCenterIndex] = useState(0);
  const count = botanicals.length;

  const goPrev = useCallback(() => {
    setCenterIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  const goNext = useCallback(() => {
    setCenterIndex((prev) => (prev + 1) % count);
  }, [count]);

  const visibleOrbs = useMemo(() => {
    if (count === 0) return [];
    const items: { item: BotanicalItem; offset: number; index: number }[] = [];
    for (let offset = -2; offset <= 2; offset++) {
      const idx = ((centerIndex + offset) % count + count) % count;
      items.push({ item: botanicals[idx], offset, index: idx });
    }
    return items;
  }, [centerIndex, botanicals, count]);

  if (count === 0) return null;

  return (
    <div className="rd-scene-container">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} color="#f5ebd8" />
        <directionalLight position={[-4, -2, 3]} intensity={0.3} color="#d8c9a3" />
        <pointLight position={[0, 2, 3]} intensity={0.4} color="#e8dcc4" distance={10} />

        {visibleOrbs.map(({ item, offset, index }) => (
          <BotanicalOrb
            key={item.id}
            name={item.name}
            scientificName={item.scientificName}
            targetX={offset * 1.8}
            colorIndex={index}
            isCenter={offset === 0}
            imagePath={item.imagePath}
          />
        ))}

        <Particles />
      </Canvas>

      {/* Navigation arrows */}
      {count > 1 && (
        <>
          <button type="button" className="rd-scene-arrow rd-scene-arrow-left" onClick={goPrev} aria-label="Previous botanical">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" className="rd-scene-arrow rd-scene-arrow-right" onClick={goNext} aria-label="Next botanical">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}

      {/* Dot indicators */}
      {count > 1 && (
        <div className="rd-scene-dots">
          {botanicals.map((b, i) => (
            <button
              key={b.id}
              type="button"
              className={`rd-scene-dot${i === centerIndex ? " rd-scene-dot-active" : ""}`}
              onClick={() => setCenterIndex(i)}
              aria-label={`Go to ${b.name}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
