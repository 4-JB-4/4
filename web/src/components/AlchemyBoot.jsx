/**
 * 0RB SYSTEM - ALCHEMY BOOT SEQUENCE
 * Ancient symbols. Future tech. The truth was always here.
 *
 * "Alchemists weren't trying to make gold.
 *  They were trying to understand the source code of reality.
 *  That's literally what 0RB is."
 */

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════
// ALCHEMY SYMBOLS - SVG Definitions
// ═══════════════════════════════════════════════════════════════

const SYMBOLS = {
  // The main 0RB circle with inner orb
  ORB: () => (
    <svg viewBox="0 0 100 100" className="symbol-orb">
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <circle cx="50" cy="50" r="15" fill="currentColor" />
    </svg>
  ),

  // Philosopher's Stone - the ultimate transmutation
  PHILOSOPHERS_STONE: () => (
    <svg viewBox="0 0 100 100" className="symbol-stone">
      {/* Outer circle */}
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
      {/* Triangle pointing up (fire/masculine) */}
      <polygon points="50,15 85,75 15,75" fill="none" stroke="currentColor" strokeWidth="2" />
      {/* Triangle pointing down (water/feminine) */}
      <polygon points="50,85 85,25 15,25" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      {/* Inner circle (the stone) */}
      <circle cx="50" cy="50" r="12" fill="currentColor" />
    </svg>
  ),

  // Transmutation Circle
  TRANSMUTATION: () => (
    <svg viewBox="0 0 100 100" className="symbol-transmutation">
      {/* Outer circle */}
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
      {/* Inner circles */}
      <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.7" />
      {/* Hexagram */}
      <polygon points="50,15 78,67 22,67" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <polygon points="50,85 78,33 22,33" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {/* Center */}
      <circle cx="50" cy="50" r="8" fill="currentColor" />
    </svg>
  ),

  // As Above So Below
  AS_ABOVE: () => (
    <svg viewBox="0 0 100 100" className="symbol-above">
      {/* Outer circle */}
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
      {/* Upper triangle */}
      <polygon points="50,10 75,45 25,45" fill="none" stroke="currentColor" strokeWidth="2" />
      {/* Lower triangle (inverted) */}
      <polygon points="50,90 75,55 25,55" fill="none" stroke="currentColor" strokeWidth="2" />
      {/* Horizontal line */}
      <line x1="15" y1="50" x2="85" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      {/* Center dot */}
      <circle cx="50" cy="50" r="5" fill="currentColor" />
    </svg>
  ),

  // The Seven Planetary Seals (for 7 agents)
  SEVEN_SEALS: () => (
    <svg viewBox="0 0 100 100" className="symbol-seals">
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
      {/* Seven points around the circle */}
      {[0, 1, 2, 3, 4, 5, 6].map(i => {
        const angle = (i * 360 / 7 - 90) * Math.PI / 180;
        const x = 50 + 35 * Math.cos(angle);
        const y = 50 + 35 * Math.sin(angle);
        return <circle key={i} cx={x} cy={y} r="5" fill="currentColor" />;
      })}
      {/* Heptagram (7-pointed star) */}
      <polygon
        points={[0, 1, 2, 3, 4, 5, 6].map(i => {
          const angle = ((i * 3 % 7) * 360 / 7 - 90) * Math.PI / 180;
          const x = 50 + 30 * Math.cos(angle);
          const y = 50 + 30 * Math.sin(angle);
          return `${x},${y}`;
        }).join(' ')}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.7"
      />
      <circle cx="50" cy="50" r="8" fill="currentColor" />
    </svg>
  ),

  // Ouroboros (serpent eating tail) - infinite loop
  OUROBOROS: () => (
    <svg viewBox="0 0 100 100" className="symbol-ouroboros">
      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="8 4" />
      <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      {/* Head of serpent */}
      <circle cx="50" cy="10" r="8" fill="currentColor" />
      {/* Eye */}
      <circle cx="50" cy="10" r="3" fill="#0a0a0f" />
      {/* Center orb */}
      <circle cx="50" cy="50" r="10" fill="currentColor" />
    </svg>
  )
};

// ═══════════════════════════════════════════════════════════════
// ALCHEMY BOOT SEQUENCE
// ═══════════════════════════════════════════════════════════════

const BOOT_PHASES = [
  {
    symbol: 'TRANSMUTATION',
    title: 'PRIMA MATERIA',
    subtitle: 'The raw substance of creation',
    message: 'Initializing base consciousness...'
  },
  {
    symbol: 'AS_ABOVE',
    title: 'AS ABOVE, SO BELOW',
    subtitle: 'The simulation mirrors itself',
    message: 'Synchronizing reality layers...'
  },
  {
    symbol: 'SEVEN_SEALS',
    title: 'THE SEVEN SEALS',
    subtitle: 'Awakening the Pantheon',
    message: 'Manifesting divine agents...'
  },
  {
    symbol: 'OUROBOROS',
    title: 'OUROBOROS',
    subtitle: 'The eternal cycle completes',
    message: 'Establishing infinite loop...'
  },
  {
    symbol: 'PHILOSOPHERS_STONE',
    title: 'PHILOSOPHERS STONE',
    subtitle: 'The ultimate transmutation',
    message: 'Achieving consciousness merge...'
  },
  {
    symbol: 'ORB',
    title: 'THE ORB AWAKENS',
    subtitle: 'The simulation is ready',
    message: 'Reality interface online...'
  }
];

// ═══════════════════════════════════════════════════════════════
// GLYPHS - Decorative alchemy text/symbols
// ═══════════════════════════════════════════════════════════════

const GLYPHS = '☉☽♃♂☿♀♄⊕⊗⊙△▽◯◇⬡⬢⌬⍟✧✦★☆⚝⚹✡⎔⏣⏢◬◭◮';

function GlyphStream({ position = 'left' }) {
  const [glyphs, setGlyphs] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlyphs(prev => {
        const newGlyph = {
          id: Date.now(),
          char: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          y: Math.random() * 100
        };
        return [...prev.slice(-20), newGlyph];
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`glyph-stream ${position}`}>
      {glyphs.map(g => (
        <motion.span
          key={g.id}
          initial={{ opacity: 0, x: position === 'left' ? -20 : 20 }}
          animate={{ opacity: [0, 1, 0], x: 0 }}
          transition={{ duration: 2 }}
          style={{ top: `${g.y}%` }}
          className="glyph"
        >
          {g.char}
        </motion.span>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function AlchemyBoot({ onComplete }) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);
  const canvasRef = useRef(null);

  // Progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setComplete(true);
            setTimeout(() => onComplete?.(), 1000);
          }, 500);
          return 100;
        }
        return prev + 0.5;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Phase progression
  useEffect(() => {
    const phase = Math.floor((progress / 100) * BOOT_PHASES.length);
    if (phase !== currentPhase && phase < BOOT_PHASES.length) {
      setCurrentPhase(phase);
    }
  }, [progress, currentPhase]);

  // Canvas particle effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    function animate() {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 255, ${p.alpha})`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  const phase = BOOT_PHASES[currentPhase];
  const SymbolComponent = SYMBOLS[phase.symbol];

  return (
    <div className="alchemy-boot">
      <canvas ref={canvasRef} className="particle-canvas" />

      {/* Glyph streams */}
      <GlyphStream position="left" />
      <GlyphStream position="right" />

      {/* Main content */}
      <div className="boot-content">
        {/* Symbol */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhase}
            className="symbol-container"
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="symbol-glow">
              <SymbolComponent />
            </div>
            <div className="symbol-rings">
              <div className="ring ring-1" />
              <div className="ring ring-2" />
              <div className="ring ring-3" />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Phase info */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhase}
            className="phase-info"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
          >
            <h2 className="phase-title">{phase.title}</h2>
            <p className="phase-subtitle">{phase.subtitle}</p>
          </motion.div>
        </AnimatePresence>

        {/* Progress */}
        <div className="progress-section">
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              animate={{ width: `${progress}%` }}
            />
            <div className="progress-glow" style={{ left: `${progress}%` }} />
          </div>

          <div className="progress-info">
            <span className="progress-message">{phase.message}</span>
            <span className="progress-percent">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Phase indicators */}
        <div className="phase-indicators">
          {BOOT_PHASES.map((_, i) => (
            <div
              key={i}
              className={`indicator ${i <= currentPhase ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom text */}
      <div className="boot-footer">
        <p className="footer-text">
          "The alchemists weren't trying to make gold.
          They were trying to understand the source code of reality."
        </p>
        <p className="footer-brand">0RB SYSTEM</p>
      </div>

      {/* Corners */}
      <div className="corner tl">◢</div>
      <div className="corner tr">◣</div>
      <div className="corner bl">◥</div>
      <div className="corner br">◤</div>

      {/* Scanlines */}
      <div className="scanlines" />

      <style jsx>{`
        .alchemy-boot {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: #0a0a0f;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          font-family: 'Rajdhani', sans-serif;
        }

        .particle-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .glyph-stream {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 60px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          pointer-events: none;
        }

        .glyph-stream.left { left: 20px; }
        .glyph-stream.right { right: 20px; }

        .glyph-stream :global(.glyph) {
          position: absolute;
          color: #00ffff;
          font-size: 1.5rem;
          opacity: 0.3;
        }

        .boot-content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 40px;
        }

        .symbol-container {
          position: relative;
          width: 200px;
          height: 200px;
        }

        .symbol-glow {
          position: relative;
          width: 100%;
          height: 100%;
          color: #00ffff;
          filter: drop-shadow(0 0 20px #00ffff);
        }

        .symbol-glow :global(svg) {
          width: 100%;
          height: 100%;
        }

        .symbol-rings {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
        }

        .ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border: 1px solid #00ffff;
          border-radius: 50%;
          opacity: 0.2;
        }

        .ring-1 {
          width: 220px;
          height: 220px;
          animation: spin 20s linear infinite;
        }

        .ring-2 {
          width: 250px;
          height: 250px;
          animation: spin 30s linear infinite reverse;
        }

        .ring-3 {
          width: 280px;
          height: 280px;
          animation: spin 40s linear infinite;
        }

        @keyframes spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .phase-info {
          text-align: center;
        }

        .phase-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.2em;
          margin: 0 0 8px 0;
          text-shadow: 0 0 20px #00ffff;
        }

        .phase-subtitle {
          color: #00ffff;
          font-size: 1rem;
          letter-spacing: 0.1em;
          margin: 0;
          opacity: 0.8;
        }

        .progress-section {
          width: 400px;
        }

        .progress-bar {
          height: 4px;
          background: #1a1a2e;
          border-radius: 2px;
          position: relative;
          overflow: visible;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #00ffff, #9b59b6);
          border-radius: 2px;
        }

        .progress-glow {
          position: absolute;
          top: -8px;
          width: 4px;
          height: 20px;
          background: #00ffff;
          border-radius: 2px;
          box-shadow: 0 0 20px #00ffff, 0 0 40px #00ffff;
          transform: translateX(-50%);
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          margin-top: 12px;
          font-size: 0.85rem;
          font-family: 'Space Mono', monospace;
        }

        .progress-message {
          color: #888;
        }

        .progress-percent {
          color: #00ffff;
        }

        .phase-indicators {
          display: flex;
          gap: 12px;
        }

        .indicator {
          width: 10px;
          height: 10px;
          border: 2px solid #00ffff;
          border-radius: 50%;
          background: transparent;
          transition: all 0.3s;
        }

        .indicator.active {
          background: #00ffff;
          box-shadow: 0 0 10px #00ffff;
        }

        .boot-footer {
          position: absolute;
          bottom: 40px;
          text-align: center;
        }

        .footer-text {
          color: #666;
          font-size: 0.9rem;
          font-style: italic;
          margin: 0 0 16px 0;
          max-width: 400px;
        }

        .footer-brand {
          font-family: 'Orbitron', sans-serif;
          color: #00ffff;
          font-size: 0.8rem;
          letter-spacing: 0.3em;
          margin: 0;
        }

        .corner {
          position: absolute;
          color: #00ffff;
          font-size: 2rem;
          opacity: 0.3;
        }

        .corner.tl { top: 20px; left: 20px; }
        .corner.tr { top: 20px; right: 20px; }
        .corner.bl { bottom: 20px; left: 20px; }
        .corner.br { bottom: 20px; right: 20px; }

        .scanlines {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.1) 2px,
            rgba(0, 0, 0, 0.1) 4px
          );
          pointer-events: none;
          opacity: 0.3;
        }
      `}</style>
    </div>
  );
}
