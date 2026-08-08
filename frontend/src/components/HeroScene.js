import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, Float } from "@react-three/drei";

function AnimatedSphere() {
  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={1.5}>
      <Sphere args={[1.4, 100, 200]} scale={2.2}>
        <MeshDistortMaterial
          color="#00d4ff"
          attach="material"
          distort={0.45}
          speed={1.8}
          roughness={0.2}
          metalness={0.6}
          opacity={0.35}
          transparent
        />
      </Sphere>
    </Float>
  );
}

function HeroScene() {
  return (
    <div className="scene-canvas" style={{ pointerEvents: "none" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#00d4ff" />
        <Suspense fallback={null}>
          <AnimatedSphere />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default HeroScene;