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

/* ─── Single botanical orb ─── */

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

  const palette = ORB_COLORS[colorIndex % ORB_COLORS.length];

  const texture = useMemo(() => {
    if (!imagePath) return null;
    const loader = new THREE.TextureLoader();
    const tex = loader.load(imagePath);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [imagePath]);

  useFrame(({ clock }) => {
    if (!groupRef.current || !orbRef.current) return;

    /* Slide X — only the group position moves, smooth lerp */
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.1);

    /* Gentle Y float — only center orb, very subtle */
    const floatY = isCenter ? Math.sin(clock.getElapsedTime() * 1.2) * 0.04 : 0;
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, floatY, 0.05);

    /* Scale */
    const targetScale = isCenter ? 0.85 : 0.55;
    orbRef.current.scale.setScalar(THREE.MathUtils.lerp(orbRef.current.scale.x, targetScale, 0.08));

    /* Material */
    const mat = orbRef.current.material as THREE.MeshPhysicalMaterial;
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, isCenter ? 0.9 : 0.45, 0.07);
    mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, isCenter ? 0.4 : 0.08, 0.07);

    /* Selection glow halo */
    if (glowRef.current) {
      const glowMat = glowRef.current.material as THREE.MeshBasicMaterial;
      const targetOpacity = isCenter
        ? 0.22 + Math.sin(clock.getElapsedTime() * 1.5) * 0.06
        : 0;
      glowMat.opacity = THREE.MathUtils.lerp(glowMat.opacity, targetOpacity, 0.07);

      const targetGlowScale = isCenter
        ? 1.6 + Math.sin(clock.getElapsedTime() * 1.0) * 0.08
        : 0.9;
      const gs = glowRef.current.scale.x;
      glowRef.current.scale.setScalar(THREE.MathUtils.lerp(gs, targetGlowScale, 0.06));
    }
  });

  return (
    <group ref={groupRef} position={[targetX, 0, 0]}>
      {/* Selection glow — large soft halo, only visible on center */}
      <mesh ref={glowRef} scale={0.9}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshBasicMaterial
          color={palette.emissive}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* The orb itself */}
      <mesh ref={orbRef}>
        <sphereGeometry args={[0.7, 64, 64]} />
        {texture ? (
          <meshPhysicalMaterial
            map={texture}
            transparent
            opacity={0.85}
            roughness={0.2}
            metalness={0.05}
            clearcoat={0.6}
            clearcoatRoughness={0.1}
            emissive={palette.emissive}
            emissiveIntensity={0.15}
          />
        ) : (
          <meshPhysicalMaterial
            color={palette.core}
            transparent
            opacity={0.75}
            roughness={0.15}
            metalness={0.05}
            clearcoat={0.8}
            clearcoatRoughness={0.08}
            emissive={palette.emissive}
            emissiveIntensity={0.15}
          />
        )}
      </mesh>

      {/* Label — only on center orb */}
      {isCenter && (
        <Html center position={[0, -1.1, 0]} style={{ pointerEvents: "none" }}>
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
            key={`${centerIndex}-${offset}`}
            name={item.name}
            scientificName={item.scientificName}
            targetX={offset * 2.2}
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
