import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Line } from "@react-three/drei";
import * as THREE from "three";

function GlobeMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  // Generate random points on sphere surface for "nodes"
  const nodePositions = useMemo(() => {
    const positions = new Float32Array(120 * 3);
    for (let i = 0; i < 120; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const r = 2.0;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  // Generate connection lines between nearby nodes
  const connections = useMemo(() => {
    const lines: [THREE.Vector3, THREE.Vector3][] = [];
    for (let i = 0; i < 120; i++) {
      for (let j = i + 1; j < 120; j++) {
        const dx = nodePositions[i * 3] - nodePositions[j * 3];
        const dy = nodePositions[i * 3 + 1] - nodePositions[j * 3 + 1];
        const dz = nodePositions[i * 3 + 2] - nodePositions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 1.2 && lines.length < 80) {
          lines.push([
            new THREE.Vector3(nodePositions[i * 3], nodePositions[i * 3 + 1], nodePositions[i * 3 + 2]),
            new THREE.Vector3(nodePositions[j * 3], nodePositions[j * 3 + 1], nodePositions[j * 3 + 2]),
          ]);
        }
      }
    }
    return lines;
  }, [nodePositions]);

  return (
    <group>
      {/* Wireframe globe */}
      <Sphere ref={meshRef} args={[2, 32, 32]}>
        <meshBasicMaterial wireframe color="#1a8a9e" opacity={0.08} transparent />
      </Sphere>

      {/* Glowing nodes */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={120}
            array={nodePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.04} color="#22d3ee" sizeAttenuation transparent opacity={0.9} />
      </points>

      {/* Connection lines */}
      {connections.map((pts, i) => (
        <Line key={i} points={pts} color="#22d3ee" lineWidth={0.5} opacity={0.2} transparent />
      ))}
    </group>
  );
}

export default function Globe3D() {
  return (
    <div className="absolute inset-0 opacity-60">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#22d3ee" />
        <GlobeMesh />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
