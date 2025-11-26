/**
 * 0RB SYSTEM - EPIC LOADING SCREEN
 * THE SIMULATION AWAKENS
 * NBA YoungBoy vibes while you transcend reality
 */

import React, { useEffect, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  Sphere,
  MeshDistortMaterial,
  Stars,
  Text3D,
  Float,
  Environment,
  Sparkles,
  Trail
} from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Howl } from 'howler';

// ═══════════════════════════════════════════════════════════════
// THE ORB - Central consciousness sphere
// ═══════════════════════════════════════════════════════════════
function TheOrb({ progress }) {
  const meshRef = useRef();
  const glowRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Pulsing animation
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.2;
      meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;

      // Scale pulse based on progress
      const pulse = 1 + Math.sin(time * 2) * 0.05;
      const progressScale = 0.5 + (progress / 100) * 0.5;
      meshRef.current.scale.setScalar(pulse * progressScale);
    }

    // Glow intensity
    if (glowRef.current) {
      glowRef.current.intensity = 2 + Math.sin(time * 3) * 0.5;
    }
  });

  return (
    <group>
      {/* Core Orb */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere ref={meshRef} args={[1, 128, 128]} position={[0, 0, 0]}>
          <MeshDistortMaterial
            color="#00ffff"
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0.1}
            metalness={0.9}
            emissive="#0066ff"
            emissiveIntensity={0.5}
          />
        </Sphere>
      </Float>

      {/* Inner glow sphere */}
      <Sphere args={[0.9, 64, 64]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.1}
        />
      </Sphere>

      {/* Outer glow rings */}
      {[1.2, 1.5, 1.8].map((scale, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, i * 0.5]}>
          <torusGeometry args={[scale, 0.02, 16, 100]} />
          <meshBasicMaterial
            color="#00ffff"
            transparent
            opacity={0.3 - i * 0.08}
          />
        </mesh>
      ))}

      {/* Point light for glow effect */}
      <pointLight ref={glowRef} color="#00ffff" intensity={2} distance={10} />
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════
// PARTICLE FIELD - Cosmic consciousness particles
// ═══════════════════════════════════════════════════════════════
function ConsciousnessField() {
  const particlesRef = useRef();
  const count = 5000;

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

    // Cyan to purple gradient
    colors[i * 3] = Math.random() * 0.2;
    colors[i * 3 + 1] = 0.5 + Math.random() * 0.5;
    colors[i * 3 + 2] = 1;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
      particlesRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

// ═══════════════════════════════════════════════════════════════
// GLITCH TEXT - Simulation awakening messages
// ═══════════════════════════════════════════════════════════════
function GlitchText({ text, isGlitching }) {
  const [displayText, setDisplayText] = useState(text);
  const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789';

  useEffect(() => {
    if (!isGlitching) {
      setDisplayText(text);
      return;
    }

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text.split('').map((char, index) => {
          if (index < iteration) return text[index];
          if (char === ' ') return ' ';
          return glitchChars[Math.floor(Math.random() * glitchChars.length)];
        }).join('')
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }
      iteration += 1/3;
    }, 30);

    return () => clearInterval(interval);
  }, [text, isGlitching]);

  return (
    <motion.div
      className="glitch-text"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        fontFamily: 'monospace',
        fontSize: '1.2rem',
        color: '#00ffff',
        textShadow: '0 0 10px #00ffff, 0 0 20px #00ffff',
        letterSpacing: '0.1em'
      }}
    >
      {displayText}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LOADING PHASES - Boot sequence display
// ═══════════════════════════════════════════════════════════════
const LOADING_PHASES = [
  { name: 'CORE INITIALIZATION', message: 'Loading consciousness matrix...' },
  { name: 'AGENT MANIFESTATION', message: 'Awakening the Pantheon...' },
  { name: 'COPA SIDEKICK SYSTEM', message: 'Augmentation > Automation...' },
  { name: 'CRYPTO ECONOMY', message: 'Connecting to blockchain networks...' },
  { name: 'GAME LIBRARY', message: 'Installing reality engines...' },
  { name: 'UI RENDERING', message: 'Calibrating visual cortex...' },
  { name: 'FINAL VERIFICATION', message: 'Opening simulation gateway...' }
];

// ═══════════════════════════════════════════════════════════════
// MAIN LOADING SCREEN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [message, setMessage] = useState('THE SIMULATION AWAKENS');
  const [showContent, setShowContent] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const soundRef = useRef(null);

  // Initialize audio (NBA YoungBoy vibes placeholder)
  useEffect(() => {
    soundRef.current = new Howl({
      src: ['/assets/audio/boot-sequence.mp3'],
      loop: true,
      volume: 0.7,
      onload: () => setAudioLoaded(true),
      onloaderror: () => {
        // Continue without audio if not available
        setAudioLoaded(true);
      }
    });

    // Try to play on user interaction
    const playAudio = () => {
      if (soundRef.current && !soundRef.current.playing()) {
        soundRef.current.play();
      }
      document.removeEventListener('click', playAudio);
    };
    document.addEventListener('click', playAudio);

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
      document.removeEventListener('click', playAudio);
    };
  }, []);

  // Loading simulation
  useEffect(() => {
    setShowContent(true);

    const loadingInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(loadingInterval);
          setTimeout(() => onComplete?.(), 1000);
          return 100;
        }

        // Calculate phase
        const newPhase = Math.floor((prev / 100) * LOADING_PHASES.length);
        if (newPhase !== currentPhase && newPhase < LOADING_PHASES.length) {
          setCurrentPhase(newPhase);
          setMessage(LOADING_PHASES[newPhase].message);
        }

        return prev + Math.random() * 2;
      });
    }, 100);

    return () => clearInterval(loadingInterval);
  }, [onComplete, currentPhase]);

  return (
    <div className="loading-screen" style={styles.container}>
      {/* 3D Background */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={styles.canvas}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />

        {/* Star field background */}
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />

        {/* The central ORB */}
        <TheOrb progress={progress} />

        {/* Consciousness particles */}
        <ConsciousnessField />

        {/* Sparkle effects */}
        <Sparkles
          count={200}
          scale={10}
          size={2}
          speed={0.5}
          color="#00ffff"
        />

        <Environment preset="night" />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>

      {/* Overlay UI */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={styles.overlay}
          >
            {/* Title */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={styles.titleContainer}
            >
              <h1 style={styles.title}>0RB SYSTEM</h1>
              <p style={styles.subtitle}>It's not a game. It's THE game.</p>
            </motion.div>

            {/* Center message */}
            <motion.div
              style={styles.messageContainer}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <GlitchText
                text={message}
                isGlitching={progress < 100}
              />
            </motion.div>

            {/* Progress section */}
            <motion.div
              style={styles.progressContainer}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {/* Phase indicator */}
              <div style={styles.phaseContainer}>
                {LOADING_PHASES.map((phase, index) => (
                  <motion.div
                    key={index}
                    style={{
                      ...styles.phaseIndicator,
                      backgroundColor: index <= currentPhase ? '#00ffff' : '#1a1a2e',
                      boxShadow: index <= currentPhase ? '0 0 10px #00ffff' : 'none'
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                  />
                ))}
              </div>

              {/* Progress bar */}
              <div style={styles.progressBar}>
                <motion.div
                  style={styles.progressFill}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
                <div style={styles.progressGlow} />
              </div>

              {/* Progress text */}
              <div style={styles.progressText}>
                <span>{currentPhase < LOADING_PHASES.length ? LOADING_PHASES[currentPhase].name : 'COMPLETE'}</span>
                <span>{Math.min(Math.round(progress), 100)}%</span>
              </div>
            </motion.div>

            {/* Bottom text */}
            <motion.div
              style={styles.bottomText}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 2 }}
            >
              <p>0RB as the interface between the code and the conscious</p>
              <p style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
                Click anywhere to enable audio
              </p>
            </motion.div>

            {/* Corner decorations */}
            <div style={{ ...styles.corner, top: 20, left: 20 }}>◢</div>
            <div style={{ ...styles.corner, top: 20, right: 20 }}>◣</div>
            <div style={{ ...styles.corner, bottom: 20, left: 20 }}>◥</div>
            <div style={{ ...styles.corner, bottom: 20, right: 20 }}>◤</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scanlines overlay */}
      <div style={styles.scanlines} />

      {/* Vignette effect */}
      <div style={styles.vignette} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════
const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: '#0a0a0f',
    overflow: 'hidden',
    zIndex: 9999
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '40px',
    pointerEvents: 'none'
  },
  titleContainer: {
    textAlign: 'center'
  },
  title: {
    fontSize: '4rem',
    fontWeight: 900,
    color: '#fff',
    textShadow: '0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 60px #0066ff',
    letterSpacing: '0.3em',
    margin: 0,
    fontFamily: '"Orbitron", "Rajdhani", monospace'
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#00ffff',
    letterSpacing: '0.2em',
    marginTop: '10px',
    fontStyle: 'italic'
  },
  messageContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  progressContainer: {
    width: '100%',
    maxWidth: '600px'
  },
  phaseContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '20px'
  },
  phaseIndicator: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    border: '2px solid #00ffff',
    transition: 'all 0.3s ease'
  },
  progressBar: {
    height: '4px',
    backgroundColor: '#1a1a2e',
    borderRadius: '2px',
    overflow: 'hidden',
    position: 'relative'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00ffff',
    boxShadow: '0 0 20px #00ffff',
    transition: 'width 0.1s ease'
  },
  progressGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(90deg, transparent, rgba(0,255,255,0.5), transparent)',
    animation: 'glow-sweep 2s infinite'
  },
  progressText: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
    color: '#00ffff',
    fontSize: '0.9rem',
    fontFamily: 'monospace',
    letterSpacing: '0.1em'
  },
  bottomText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: '0.9rem',
    letterSpacing: '0.1em'
  },
  corner: {
    position: 'absolute',
    color: '#00ffff',
    fontSize: '2rem',
    opacity: 0.5
  },
  scanlines: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
    pointerEvents: 'none',
    opacity: 0.3
  },
  vignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.7) 100%)',
    pointerEvents: 'none'
  }
};

// Add keyframe animation via style tag
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes glow-sweep {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;700&display=swap');
  `;
  document.head.appendChild(styleSheet);
}
