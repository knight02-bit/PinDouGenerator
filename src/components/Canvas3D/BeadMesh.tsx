import { useRef } from 'react';
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

  const handlePointerEnter = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onPointerEnter();
    document.body.style.cursor = 'pointer';
  };

  const handlePointerLeave = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onPointerLeave();
    document.body.style.cursor = 'auto';
  };

  const scale = isHovered ? 1.2 : 1;
  const emissiveIntensity = isHovered ? 0.5 : 0;

  if (beadStyle === 'cylinder') {
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
