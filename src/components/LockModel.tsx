// components/LockModel.tsx
import { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Preload the model
useGLTF.preload('/models/lock_and_key02.glb');

interface LockProps {
  position?: [number, number, number];
  scale?: number;
}

export function LockModel({ position = [0, -1, 0], scale = 0.5 }: LockProps) {
  const { scene } = useGLTF('/models/lock_and_key02.glb');
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.5;
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <primitive
      ref={ref}
      object={scene}
      position={position}
      scale={scale}
    />
  );
}
