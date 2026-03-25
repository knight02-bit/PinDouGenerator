import { useRef, useState } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';

interface BeadMeshProps {
  position: [number, number, number];
  color: string;
  isHovered: boolean;
  beadStyle: 'cylinder' | 'sphere';
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

export function BeadMesh({
  position,
  color,
  isHovered,
  beadStyle,
  onPointerEnter,
  onPointerLeave,
}: BeadMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const handlePointerEnter = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    onPointerEnter();
    document.body.style.cursor = 'pointer';
  };

  const handlePointerLeave = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(false);
    onPointerLeave();
    document.body.style.cursor = 'auto';
  };

  const scale = isHovered || hovered ? 1.2 : 1;
  const emissiveIntensity = isHovered || hovered ? 0.5 : 0;

  if (beadStyle === 'cylinder') {
    // Hollow cylinder (torus-like shape)
    return (
      <mesh
        ref={meshRef}
        position={position}
        scale={scale}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <torusGeometry args={[0.5, 0.2, 8, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
    );
  }

  // Sphere style
  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={scale}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={emissiveIntensity}
        roughness={0.4}
        metalness={0.2}
      />
    </mesh>
  );
}
