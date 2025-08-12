// components/CyberGrid.tsx
import { useMemo, useRef } from 'react';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function CyberGrid() {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const array = new Float32Array(400 * 3);
    for (let i = 0; i < 400 * 3; i++) {
      array[i] = (Math.random() - 0.5) * 8;
    }
    return array;
  }, []);

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial size={0.03} color="#00FFF0" transparent />
    </Points>
  );
}
