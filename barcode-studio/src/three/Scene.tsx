import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import Bottle from "./Bottle";
import type { Symbology } from "../lib/gtin";

interface SceneProps {
  gtin: string | null;
  symbology: Symbology;
  productName: string;
  subtitle: string;
}

export default function Scene({ gtin, symbology, productName, subtitle }: SceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0.4, 5.5], fov: 32 }}
      gl={{
        antialias: true,
        alpha: false,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.9,
      }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor("#0b0b0a", 1);
        scene.background = new THREE.Color("#0b0b0a");
      }}
    >
      <fog attach="fog" args={["#0b0b0a", 8, 16]} />

      <ambientLight intensity={0.4} />
      <directionalLight
        position={[3, 5, 4]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={12}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
      />
      <directionalLight position={[-4, 2, -2]} intensity={0.35} color={"#d4a84a"} />
      <pointLight position={[0, 2, 3]} intensity={0.25} color={"#ffffff"} />
      <hemisphereLight args={["#8a7a58", "#1a1a18", 0.2]} />

      <Bottle
        gtin={gtin}
        symbology={symbology}
        productName={productName}
        subtitle={subtitle}
      />

      <ContactShadows
        position={[0, -1.31, 0]}
        opacity={0.55}
        scale={8}
        blur={2.4}
        far={2}
        color={"#000000"}
      />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.9}
        rotateSpeed={0.5}
      />
    </Canvas>
  );
}
