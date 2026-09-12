import React, { Suspense, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import { Environment, Float, OrbitControls, RoundedBox, Sparkles, useProgress, Html } from '@react-three/drei';
import * as THREE from 'three';
import './style.css';

const finishes = [
  { name: 'Pearl', color: '#f3efe6' },
  { name: 'Sage', color: '#9daf9a' },
  { name: 'Coral', color: '#e9917d' },
  { name: 'Midnight', color: '#252733' },
];

function LoadingFallback() {
  const { progress } = useProgress();
  return <Html center><div className="loader">Loading 3D · {Math.round(progress)}%</div></Html>;
}

function Product({ color, spin }) {
  const ring = useMemo(() => new THREE.TorusGeometry(1.28, 0.07, 20, 72), []);
  return (
    <group rotation={[0, spin, 0]}>
      <Float speed={1.5} rotationIntensity={0.18} floatIntensity={0.32}>
        <RoundedBox args={[2.5, 0.72, 1.72]} radius={0.28} smoothness={5}>
          <meshStandardMaterial color={color} roughness={0.28} metalness={0.38} />
        </RoundedBox>
        <mesh position={[0, 0.39, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.86, 1.1]} />
          <meshStandardMaterial color="#17181d" roughness={0.2} metalness={0.1} />
        </mesh>
        <mesh position={[-0.68, 0.43, 0.06]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.19, 48]} />
          <meshStandardMaterial color="#d8d3c6" roughness={0.45} />
        </mesh>
        <mesh position={[0.73, 0.43, 0.02]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.19, 48]} />
          <meshStandardMaterial color="#b6c2ff" emissive="#525ea8" emissiveIntensity={0.28} />
        </mesh>
      </Float>
      <primitive object={new THREE.Mesh(ring, new THREE.MeshStandardMaterial({ color: '#ddd8cd', metalness: 0.8, roughness: 0.22 }))} position={[0, -0.02, 0]} rotation={[Math.PI / 2, 0, 0]} />
    </group>
  );
}

function Scene({ color, spin }) {
  return (
    <Canvas camera={{ position: [4.3, 3.1, 5.8], fov: 43 }} dpr={[1, 1.7]} gl={{ antialias: true }}>
      <color attach="background" args={['#f7f4ed']} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[4, 6, 4]} intensity={3.2} castShadow />
      <directionalLight position={[-4, 2, -2]} intensity={1.1} />
      <Suspense fallback={<LoadingFallback />}>
        <Product color={color} spin={spin} />
        <Sparkles count={34} scale={[8, 4, 8]} size={1.2} speed={0.18} opacity={0.18} />
        <Environment preset="studio" />
      </Suspense>
      <OrbitControls enablePan={false} minDistance={4.7} maxDistance={8} minPolarAngle={Math.PI / 3.5} maxPolarAngle={Math.PI / 1.8} />
    </Canvas>
  );
}

function App() {
  const [finish, setFinish] = useState(0);
  const [spin, setSpin] = useState(0.42);
  const [autoRotate, setAutoRotate] = useState(false);
  const [showSpecs, setShowSpecs] = useState(false);

  const color = finishes[finish].color;
  const selected = finishes[finish].name;

  React.useEffect(() => {
    if (!autoRotate) return;
    const id = window.setInterval(() => setSpin((s) => s + 0.06), 80);
    return () => window.clearInterval(id);
  }, [autoRotate]);

  return (
    <main className="page">
      <section className="hero">
        <div className="copy">
          <div className="eyebrow">FLYRANK / FE-AA2</div>
          <h1>Your object,<br /><em>your finish.</em></h1>
          <p className="lede">A small 3D product experience built for the browser. Change the material, orbit freely, and preview the result in real time.</p>
          <div className="pill">Interactive 3D · React Three Fiber</div>
          <div className="controls" aria-label="3D controls">
            <div>
              <div className="label">Choose finish</div>
              <div className="swatches">
                {finishes.map((item, index) => (
                  <button
                    key={item.name}
                    className={`swatch ${index === finish ? 'active' : ''}`}
                    style={{ background: item.color }}
                    aria-label={`${item.name} finish`}
                    aria-pressed={index === finish}
                    onClick={() => setFinish(index)}
                    title={item.name}
                  />
                ))}
              </div>
              <div className="selection">Selected: <strong>{selected}</strong></div>
            </div>
            <div className="action-row">
              <button className="button secondary" onClick={() => setAutoRotate((v) => !v)} aria-pressed={autoRotate}>
                {autoRotate ? 'Pause motion' : 'Auto-rotate'}
              </button>
              <button className="button" onClick={() => setShowSpecs((v) => !v)} aria-expanded={showSpecs}> {showSpecs ? 'Hide specs' : 'View specs'} </button>
            </div>
            {showSpecs && <div className="specs" role="region" aria-label="Product specifications"><span>Aluminium shell</span><span>Studio lighting</span><span>60 FPS target</span></div>}
          </div>
        </div>
        <div className="stage" aria-label="Interactive 3D product viewer">
          <div className="stage-top"><span>LIVE PREVIEW</span><span>DRAG TO ORBIT</span></div>
          <Scene color={color} spin={spin} />
          <div className="stage-bottom"><span>Material · {selected}</span><span>Scroll / pinch to zoom</span></div>
        </div>
      </section>
      <footer>Keyboard-friendly controls · lazy-loaded 3D scene · fallback loader · performance-conscious canvas</footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
