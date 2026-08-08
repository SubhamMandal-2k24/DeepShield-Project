import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Sparkles } from "@react-three/drei";

function AnimatedSphere() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.6} floatIntensity={1.8}>
      <Sphere ref={meshRef} args={[1.4, 100, 200]} scale={2.3}>
        <MeshDistortMaterial
          color="#00ffb2"
          attach="material"
          distort={0.5}
          speed={2}
          roughness={0.15}
          metalness={0.7}
          opacity={0.28}
          transparent
        />
      </Sphere>
    </Float>
  );
}

function HeroScene() {
  return (
    <div className="scene-canvas">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={1.4} color="#00ffb2" />
        <pointLight position={[-5, -3, 3]} intensity={0.8} color="#ff2e93" />
        <Suspense fallback={null}>
          <AnimatedSphere />
          <Sparkles count={60} scale={8} size={2} speed={0.4} color="#00ffb2" opacity={0.5} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default HeroScene;