import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Symbology } from "../lib/gtin";
import { createBarcodeCanvas } from "../lib/barcode";

interface BottleProps {
  gtin: string | null;
  symbology: Symbology;
  productName: string;
  subtitle: string;
}

const LABEL_BG = "#f0ece3";
const LABEL_FG = "#1a1a18";
const BOTTLE_COLOR = "#e9e2d1";
const CAP_COLOR = "#1e1e1c";

export default function Bottle({ gtin, symbology, productName, subtitle }: BottleProps) {
  const group = useRef<THREE.Group>(null);
  const labelTexture = useMemo(() => new THREE.CanvasTexture(makePlaceholderCanvas()), []);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = LABEL_BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = LABEL_FG;
    ctx.font = "600 38px 'Inter', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText((productName || "KYRILL").toUpperCase(), canvas.width / 2, 96);

    if (subtitle) {
      ctx.font = "italic 24px 'Inter', sans-serif";
      ctx.fillStyle = "#6d6a63";
      ctx.fillText(subtitle, canvas.width / 2, 132);
    }

    if (gtin) {
      try {
        const bc = createBarcodeCanvas({
          value: gtin,
          symbology,
          scale: 4,
          height: 18,
          background: LABEL_BG.replace("#", ""),
          foreground: LABEL_FG.replace("#", ""),
        });
        const bcAspect = bc.width / bc.height;
        const drawH = 260;
        const drawW = drawH * bcAspect;
        const x = (canvas.width - drawW) / 2;
        const y = 180;
        ctx.drawImage(bc, x, y, drawW, drawH);
      } catch {
        ctx.fillStyle = "#a84242";
        ctx.font = "16px 'JetBrains Mono', monospace";
        ctx.fillText("invalid GTIN", canvas.width / 2, canvas.height / 2);
      }
    } else {
      ctx.fillStyle = "#b5b0a4";
      ctx.font = "14px 'JetBrains Mono', monospace";
      ctx.fillText("AWAITING GTIN", canvas.width / 2, canvas.height / 2);
    }

    const bottomText = gtin ? `${symbology.toUpperCase()} · ${gtin}` : "";
    if (bottomText) {
      ctx.fillStyle = "#6d6a63";
      ctx.font = "500 18px 'JetBrains Mono', monospace";
      ctx.fillText(bottomText, canvas.width / 2, canvas.height - 40);
    }

    labelTexture.image = canvas;
    labelTexture.needsUpdate = true;
    labelTexture.colorSpace = THREE.SRGBColorSpace;
  }, [gtin, symbology, productName, subtitle, labelTexture]);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group ref={group} position={[0, -0.3, 0]}>
      {/* Body */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1, 1, 2.6, 96, 1, false]} />
        <meshPhysicalMaterial
          color={BOTTLE_COLOR}
          roughness={0.35}
          metalness={0.0}
          clearcoat={0.4}
          clearcoatRoughness={0.5}
          sheen={0.4}
          sheenColor={"#ffeccf"}
        />
      </mesh>

      {/* Label band (slightly larger radius to avoid z-fighting) */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[1.005, 1.005, 1.3, 96, 1, true]} />
        <meshStandardMaterial
          map={labelTexture}
          roughness={0.7}
          metalness={0.0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Shoulder (tapered disc) */}
      <mesh position={[0, 1.7, 0]} castShadow>
        <cylinderGeometry args={[0.55, 1, 0.3, 96]} />
        <meshPhysicalMaterial
          color={BOTTLE_COLOR}
          roughness={0.35}
          metalness={0.0}
          clearcoat={0.4}
          clearcoatRoughness={0.5}
        />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.95, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.55, 0.2, 64]} />
        <meshPhysicalMaterial color={BOTTLE_COLOR} roughness={0.3} metalness={0.0} />
      </mesh>

      {/* Cap */}
      <mesh position={[0, 2.28, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.45, 64]} />
        <meshStandardMaterial color={CAP_COLOR} roughness={0.25} metalness={0.15} />
      </mesh>

      {/* Cap ridge detail */}
      <mesh position={[0, 2.05, 0]} castShadow>
        <cylinderGeometry args={[0.62, 0.62, 0.05, 64]} />
        <meshStandardMaterial color={"#2a2a28"} roughness={0.4} />
      </mesh>

      {/* Bottom */}
      <mesh position={[0, -1, 0]} receiveShadow>
        <cylinderGeometry args={[1, 1, 0.01, 96]} />
        <meshPhysicalMaterial color={BOTTLE_COLOR} roughness={0.35} metalness={0.0} />
      </mesh>
    </group>
  );
}

function makePlaceholderCanvas(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 512;
  const ctx = c.getContext("2d");
  if (ctx) {
    ctx.fillStyle = LABEL_BG;
    ctx.fillRect(0, 0, c.width, c.height);
  }
  return c;
}
