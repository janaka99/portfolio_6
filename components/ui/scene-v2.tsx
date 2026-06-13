"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei";
import { useRef, useMemo, useEffect, useState } from "react";
import * as THREE from "three";

// ─── Floating Particle Field ──────────────────────────────────────────────────
function ParticleField({ count = 600 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null);

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      sz[i] = Math.random() * 2 + 0.5;
    }
    return [pos, sz];
  }, [count]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.01;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#a855f7"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Grid of secondary particles (blue/cyan) ─────────────────────────────────
function GridParticles({ count = 300 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = -state.clock.getElapsedTime() * 0.015;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#06b6d4" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

// ─── Central Wireframe Icosahedron ────────────────────────────────────────────
function WireIcosahedron({ mouse }: { mouse: { x: number; y: number } }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      meshRef.current.rotation.x = t * 0.12 + mouse.y * 0.3;
      meshRef.current.rotation.y = t * 0.18 + mouse.x * 0.3;
    }
    if (innerRef.current) {
      const t = state.clock.getElapsedTime();
      innerRef.current.rotation.x = -t * 0.08;
      innerRef.current.rotation.y = t * 0.14;
    }
  });

  return (
    <Float speed={1.5} floatIntensity={1.5} rotationIntensity={0}>
      <group>
        {/* Outer wireframe */}
        <mesh ref={meshRef} scale={2.2}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            color="#9333ea"
            wireframe
            transparent
            opacity={0.25}
            emissive="#6d28d9"
            emissiveIntensity={0.4}
          />
        </mesh>
        {/* Inner solid with distortion */}
        <mesh ref={innerRef} scale={1.3}>
          <icosahedronGeometry args={[1, 2]} />
          <MeshDistortMaterial
            color="#0d0d0d"
            distort={0.35}
            speed={1.5}
            roughness={0.1}
            metalness={0.9}
            emissive="#4c1d95"
            emissiveIntensity={0.2}
          />
        </mesh>
        {/* Glow ring */}
        <mesh scale={2.6} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1, 0.005, 8, 80]} />
          <meshStandardMaterial
            color="#c084fc"
            emissive="#c084fc"
            emissiveIntensity={2}
            transparent
            opacity={0.5}
          />
        </mesh>
      </group>
    </Float>
  );
}

// ─── Mouse-reactive camera rig ────────────────────────────────────────────────
function CameraRig({ mouse }: { mouse: { x: number; y: number } }) {
  const { camera } = useThree();
  useFrame(() => {
    camera.position.x += (mouse.x * 0.8 - camera.position.x) * 0.05;
    camera.position.y += (mouse.y * 0.4 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// ─── Exported Scene ───────────────────────────────────────────────────────────
export default function SceneV2() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={2} color="#c084fc" />
        <pointLight position={[-5, -3, -3]} intensity={1} color="#06b6d4" />
        <ParticleField count={700} />
        <GridParticles count={400} />
        <WireIcosahedron mouse={mouse} />
        <CameraRig mouse={mouse} />
      </Canvas>
    </div>
  );
}
