import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial, Sphere, Torus } from '@react-three/drei';
import * as THREE from 'three';

/* ---- Individual 3D components ---- */

function FloatingResistor({ position, rotation, color = '#00c8ff' }) {
  const meshRef = useRef();
  useFrame((state) => {
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.3;
    meshRef.current.rotation.y += 0.008;
  });
  return (
    <group ref={meshRef} position={position} rotation={rotation}>
      {/* Body */}
      <mesh>
        <boxGeometry args={[0.8, 0.25, 0.25]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Leads */}
      <mesh position={[-0.6, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
        <meshStandardMaterial color="#aaaaaa" metalness={1} roughness={0.2} />
      </mesh>
      <mesh position={[0.6, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
        <meshStandardMaterial color="#aaaaaa" metalness={1} roughness={0.2} />
      </mesh>
    </group>
  );
}

function FloatingCapacitor({ position }) {
  const groupRef = useRef();
  useFrame((state) => {
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.7 + position[1]) * 0.2;
    groupRef.current.rotation.y += 0.006;
  });
  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <cylinderGeometry args={[0.2, 0.2, 0.5, 16]} />
        <meshStandardMaterial color="#7b2ff7" emissive="#7b2ff7" emissiveIntensity={0.5} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.2, 8]} />
        <meshStandardMaterial color="#cccccc" metalness={1} />
      </mesh>
    </group>
  );
}

function ElectronParticle({ orbitRadius, speed, startAngle, yOffset }) {
  const meshRef = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + startAngle;
    meshRef.current.position.x = Math.cos(t) * orbitRadius;
    meshRef.current.position.z = Math.sin(t) * orbitRadius;
    meshRef.current.position.y = yOffset + Math.sin(t * 2) * 0.2;
  });
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.06, 8, 8]} />
      <meshStandardMaterial color="#00ffea" emissive="#00ffea" emissiveIntensity={2} />
    </mesh>
  );
}

function CircuitWireRing() {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * 3, Math.sin(angle * 0.5) * 0.5, Math.sin(angle) * 3));
    }
    return pts;
  }, []);

  const curve = new THREE.CatmullRomCurve3(points, true);
  const tubeGeom = new THREE.TubeGeometry(curve, 128, 0.03, 8, true);

  const matRef = useRef();
  useFrame((state) => {
    if (matRef.current) matRef.current.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
  });

  return (
    <mesh geometry={tubeGeom}>
      <meshStandardMaterial ref={matRef} color="#00c8ff" emissive="#00c8ff" emissiveIntensity={0.5} metalness={0.9} roughness={0.1} />
    </mesh>
  );
}

function GlowingSphere() {
  const ref = useRef();
  useFrame((state) => {
    ref.current.distort = 0.3 + Math.sin(state.clock.elapsedTime) * 0.1;
  });
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere args={[1.2, 64, 64]}>
        <MeshDistortMaterial
          ref={ref}
          color="#0a1628"
          emissive="#00c8ff"
          emissiveIntensity={0.15}
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.7}
          wireframe={false}
        />
      </Sphere>
    </Float>
  );
}

function Scene() {
  const electrons = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      orbitRadius: 2.5 + (i % 3) * 0.4,
      speed: 0.8 + i * 0.12,
      startAngle: (i / 12) * Math.PI * 2,
      yOffset: (i % 4) * 0.3 - 0.45,
    })), []);

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#00c8ff" />
      <pointLight position={[-5, -3, -5]} intensity={1.5} color="#7b2ff7" />
      <pointLight position={[0, 0, 3]} intensity={1} color="#00ffea" />
      <spotLight position={[0, 8, 0]} angle={0.4} intensity={3} color="#00c8ff" penumbra={1} />

      <GlowingSphere />
      <CircuitWireRing />

      {electrons.map(e => <ElectronParticle key={e.id} {...e} />)}

      <FloatingResistor position={[-3.5, 1.5, 0]} rotation={[0.3, 0, 0]} color="#00c8ff" />
      <FloatingResistor position={[3.5, -1, 0.5]} rotation={[0, 0.5, 0.2]} color="#ff7b00" />
      <FloatingResistor position={[0, 2.5, -2]} rotation={[0.5, 0, 0]} color="#00ff88" />

      <FloatingCapacitor position={[2.5, 1.8, 1]} />
      <FloatingCapacitor position={[-2.5, -1.5, -1]} />

      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} maxPolarAngle={Math.PI * 0.65} minPolarAngle={Math.PI * 0.35} />
    </>
  );
}

export default function CircuitCanvas3D() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 55 }} dpr={[1, 2]}>
        <Scene />
      </Canvas>
    </div>
  );
}
