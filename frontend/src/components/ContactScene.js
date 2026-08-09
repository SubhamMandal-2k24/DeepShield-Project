import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Sparkles, Float, Sphere, MeshDistortMaterial } from "@react-three/drei";

function FloatingOrb() {
  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={1.4}>
      <Sphere args={[1, 100, 200]} scale={1.6}>
        <MeshDistortMaterial
          color="#ff2e93"
          attach="material"
          distort={0.4}
          speed={1.6}
          roughness={0.2}
          metalness={0.6}
          opacity={0.2}
          transparent
        />
      </Sphere>
    </Float>
  );
}

function ContactScene() {
  return (
    <div className="scene-canvas">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#00ffb2" />
        <pointLight position={[-5, -3, 3]} intensity={0.8} color="#ff2e93" />
        <Suspense fallback={null}>
          <FloatingOrb />
          <Sparkles count={50} scale={7} size={2} speed={0.3} color="#00ffb2" opacity={0.4} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default ContactScene;