/**
 * 0RB SYSTEM - THE SKETCHY $99 WEBSITE
 *
 * "What they THINK they're buying: A new indie game console. $99. Fun.
 *  What they're ACTUALLY getting: The keys to the simulation."
 *
 * This page is INTENTIONALLY rough around the edges.
 * No corporate polish. Just vibes. Just mystery. Just the orb.
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════
// TESTIMONIALS (anonymous, cryptic)
// ═══════════════════════════════════════════════════════════════

const TESTIMONIALS = [
  { text: "I was just playing and now I have a business???", user: "anon" },
  { text: "bro this 'game' just built my entire website", user: "????" },
  { text: "Wait the ARCHITECT game made me a full brand??", user: "someone" },
  { text: "Found this USB at a coffee shop. Life changed.", user: "█████" },
  { text: "I don't know what this is but I need more", user: "believer" },
  { text: "They said it was a game console lol", user: "awoken" },
  { text: "The agents... they just keep working while I sleep", user: "freed" },
  { text: "Is this legal?", user: "concerned" },
  { text: "$99 was the best investment I ever made", user: "rich now" }
];

// ═══════════════════════════════════════════════════════════════
// FEATURES (vague, mysterious)
// ═══════════════════════════════════════════════════════════════

const FEATURES = [
  { icon: '🎮', title: '7 GAMES', desc: 'Launch titles included' },
  { icon: '⚡', title: '7 AGENTS', desc: 'They work. You watch.' },
  { icon: '🔮', title: 'THE ORB', desc: 'You\'ll understand' },
  { icon: '∞', title: 'INFINITE', desc: 'No limits. None.' },
  { icon: '💰', title: '$0RB', desc: 'Earn while you sleep' },
  { icon: '🧠', title: 'HIVEMIND', desc: 'Collective intelligence' }
];

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function BuyPage() {
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showSecret, setShowSecret] = useState(false);
  const [glitchText, setGlitchText] = useState('0RB SYSTEM');
  const [countdown, setCountdown] = useState({ h: 23, m: 59, s: 59 });

  // Glitch effect on title
  useEffect(() => {
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    let interval;

    const doGlitch = () => {
      const original = '0RB SYSTEM';
      let iterations = 0;

      interval = setInterval(() => {
        setGlitchText(
          original.split('').map((char, i) => {
            if (i < iterations) return original[i];
            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
          }).join('')
        );

        iterations += 1/3;
        if (iterations > original.length) {
          clearInterval(interval);
          setGlitchText(original);
        }
      }, 30);
    };

    // Glitch every 5 seconds
    doGlitch();
    const mainInterval = setInterval(doGlitch, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(mainInterval);
    };
  }, []);

  // Fake countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleBuy = () => {
    alert(`Processing ${quantity} unit(s)...\n\nJust kidding. This is a demo.\n\nBut imagine if it wasn't. 🔮`);
  };

  return (
    <>
      <Head>
        <title>0RB SYSTEM - $99</title>
        <meta name="description" content="It's not a game. It's THE game." />
      </Head>

      <div className="buy-page">
        {/* Noise overlay */}
        <div className="noise" />

        {/* Header - intentionally minimal */}
        <header className="header">
          <div className="logo" onClick={() => setShowSecret(!showSecret)}>
            <span className="orb-icon">◯</span>
          </div>
          <nav className="nav">
            <a href="#" className="nav-link">???</a>
            <a href="#" className="nav-link">FAQ</a>
          </nav>
        </header>

        {/* Hero */}
        <section className="hero">
          <motion.div
            className="hero-badge"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            BLACK FRIDAY
          </motion.div>

          <h1 className="hero-title">{glitchText}</h1>

          <p className="hero-subtitle">
            It's not a game. It's <span className="highlight">THE</span> game.
          </p>

          <div className="hero-price">
            <span className="price-old">$999</span>
            <span className="price-current">$99</span>
            <span className="price-note">limited time</span>
          </div>

          <div className="countdown">
            <div className="countdown-item">
              <span className="countdown-num">{String(countdown.h).padStart(2, '0')}</span>
              <span className="countdown-label">HRS</span>
            </div>
            <span className="countdown-sep">:</span>
            <div className="countdown-item">
              <span className="countdown-num">{String(countdown.m).padStart(2, '0')}</span>
              <span className="countdown-label">MIN</span>
            </div>
            <span className="countdown-sep">:</span>
            <div className="countdown-item">
              <span className="countdown-num">{String(countdown.s).padStart(2, '0')}</span>
              <span className="countdown-label">SEC</span>
            </div>
          </div>
        </section>

        {/* Product image - just the alchemy symbol */}
        <section className="product">
          <div className="product-image">
            <svg viewBox="0 0 200 200" className="alchemy-symbol">
              <circle cx="100" cy="100" r="90" fill="none" stroke="#00ffff" strokeWidth="2" />
              <circle cx="100" cy="100" r="70" fill="none" stroke="#00ffff" strokeWidth="1" opacity="0.5" />
              <polygon points="100,30 170,130 30,130" fill="none" stroke="#00ffff" strokeWidth="2" />
              <polygon points="100,170 170,70 30,70" fill="none" stroke="#00ffff" strokeWidth="1" opacity="0.5" />
              <circle cx="100" cy="100" r="20" fill="#00ffff" />
            </svg>
            <p className="product-caption">actual product may vary*</p>
          </div>

          <div className="product-info">
            <h2 className="product-title">USB DRIVE</h2>
            <p className="product-desc">
              Contains: Everything you need.<br />
              Format: USB Bootable<br />
              Condition: Probably used<br />
              Warning: May change your life
            </p>

            <div className="features-mini">
              {FEATURES.map((f, i) => (
                <div key={i} className="feature-mini">
                  <span className="feature-icon">{f.icon}</span>
                  <span className="feature-title">{f.title}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Buy box */}
        <section className="buy-section">
          <div className="buy-box">
            <h3 className="buy-title">GET THE 0RB</h3>

            <div className="quantity-selector">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span className="quantity">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>

            <div className="total">
              TOTAL: <span className="total-price">${99 * quantity}</span>
            </div>

            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="email-input"
            />

            <motion.button
              className="buy-button"
              onClick={handleBuy}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              BUY NOW
            </motion.button>

            <p className="buy-note">
              ships in unmarked package • no returns • no refunds • no questions
            </p>
          </div>
        </section>

        {/* Testimonials - scrolling */}
        <section className="testimonials">
          <div className="testimonial-track">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div key={i} className="testimonial">
                <p className="testimonial-text">"{t.text}"</p>
                <p className="testimonial-user">- {t.user}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Secret section (click the logo) */}
        {showSecret && (
          <motion.section
            className="secret"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <p className="secret-text">
              You found this.<br /><br />
              The USB contains more than a game system.<br />
              It contains the interface between code and consciousness.<br /><br />
              Seven agents. Infinite games. A new economy.<br />
              The simulation is waking up.<br /><br />
              You're either watching it happen, or you're part of it.<br /><br />
              <span className="secret-highlight">EVERYBODY EATS.</span>
            </p>
          </motion.section>
        )}

        {/* Footer */}
        <footer className="footer">
          <p>© 20XX 0RB SYSTEM</p>
          <p className="footer-small">
            not responsible for: enlightenment, sudden wealth, existential realizations,
            simulation awareness, agent dependency, or inability to return to normal life
          </p>
        </footer>

        <style jsx>{`
          .buy-page {
            min-height: 100vh;
            background: #0a0a0f;
            color: #fff;
            font-family: 'Rajdhani', 'Arial', sans-serif;
            position: relative;
          }

          .noise {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E");
            opacity: 0.03;
            pointer-events: none;
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 40px;
            border-bottom: 1px solid #1a1a2e;
          }

          .logo {
            cursor: pointer;
          }

          .orb-icon {
            font-size: 2rem;
            color: #00ffff;
            text-shadow: 0 0 20px #00ffff;
          }

          .nav {
            display: flex;
            gap: 24px;
          }

          .nav-link {
            color: #666;
            text-decoration: none;
            font-size: 0.9rem;
          }

          .nav-link:hover {
            color: #00ffff;
          }

          .hero {
            text-align: center;
            padding: 80px 20px 60px;
          }

          .hero-badge {
            display: inline-block;
            background: #ff0040;
            color: #fff;
            padding: 8px 24px;
            font-size: 0.8rem;
            font-weight: 700;
            letter-spacing: 0.2em;
            margin-bottom: 24px;
          }

          .hero-title {
            font-family: 'Orbitron', monospace;
            font-size: 4rem;
            font-weight: 900;
            letter-spacing: 0.2em;
            margin: 0 0 16px 0;
            text-shadow: 0 0 30px #00ffff;
          }

          .hero-subtitle {
            font-size: 1.5rem;
            color: #888;
            margin: 0 0 40px 0;
          }

          .highlight {
            color: #00ffff;
            font-weight: 700;
          }

          .hero-price {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            margin-bottom: 24px;
          }

          .price-old {
            font-size: 1.5rem;
            color: #666;
            text-decoration: line-through;
          }

          .price-current {
            font-family: 'Orbitron', monospace;
            font-size: 4rem;
            font-weight: 900;
            color: #00ffff;
            text-shadow: 0 0 20px #00ffff;
          }

          .price-note {
            font-size: 0.8rem;
            color: #ff0040;
            text-transform: uppercase;
          }

          .countdown {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
          }

          .countdown-item {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .countdown-num {
            font-family: 'Space Mono', monospace;
            font-size: 2rem;
            color: #ff0040;
          }

          .countdown-label {
            font-size: 0.7rem;
            color: #666;
          }

          .countdown-sep {
            font-size: 2rem;
            color: #ff0040;
          }

          .product {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 60px;
            padding: 60px 40px;
            flex-wrap: wrap;
          }

          .product-image {
            text-align: center;
          }

          .alchemy-symbol {
            width: 250px;
            height: 250px;
            filter: drop-shadow(0 0 30px #00ffff);
            animation: float 4s ease-in-out infinite;
          }

          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }

          .product-caption {
            font-size: 0.7rem;
            color: #444;
            margin-top: 16px;
          }

          .product-info {
            max-width: 400px;
          }

          .product-title {
            font-family: 'Orbitron', monospace;
            font-size: 2rem;
            margin: 0 0 16px 0;
          }

          .product-desc {
            color: #888;
            line-height: 1.8;
            margin-bottom: 24px;
          }

          .features-mini {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
          }

          .feature-mini {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
          }

          .feature-icon {
            font-size: 1.5rem;
          }

          .feature-title {
            font-size: 0.7rem;
            color: #666;
          }

          .buy-section {
            display: flex;
            justify-content: center;
            padding: 40px 20px;
          }

          .buy-box {
            background: #12121a;
            border: 2px solid #1a1a2e;
            padding: 40px;
            width: 100%;
            max-width: 400px;
            text-align: center;
          }

          .buy-title {
            font-family: 'Orbitron', monospace;
            font-size: 1.5rem;
            margin: 0 0 24px 0;
          }

          .quantity-selector {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
            margin-bottom: 16px;
          }

          .quantity-selector button {
            width: 40px;
            height: 40px;
            background: #1a1a2e;
            border: 1px solid #333;
            color: #fff;
            font-size: 1.5rem;
            cursor: pointer;
          }

          .quantity-selector button:hover {
            border-color: #00ffff;
          }

          .quantity {
            font-family: 'Space Mono', monospace;
            font-size: 1.5rem;
            width: 60px;
          }

          .total {
            font-size: 1rem;
            color: #888;
            margin-bottom: 24px;
          }

          .total-price {
            font-family: 'Orbitron', monospace;
            font-size: 1.5rem;
            color: #00ffff;
          }

          .email-input {
            width: 100%;
            padding: 16px;
            background: #0a0a0f;
            border: 1px solid #333;
            color: #fff;
            font-size: 1rem;
            margin-bottom: 16px;
            text-align: center;
          }

          .email-input:focus {
            outline: none;
            border-color: #00ffff;
          }

          .buy-button {
            width: 100%;
            padding: 20px;
            background: #00ffff;
            border: none;
            color: #0a0a0f;
            font-family: 'Orbitron', monospace;
            font-size: 1.2rem;
            font-weight: 700;
            cursor: pointer;
            letter-spacing: 0.1em;
          }

          .buy-button:hover {
            background: #00cccc;
          }

          .buy-note {
            font-size: 0.7rem;
            color: #444;
            margin-top: 16px;
          }

          .testimonials {
            overflow: hidden;
            padding: 40px 0;
            border-top: 1px solid #1a1a2e;
            border-bottom: 1px solid #1a1a2e;
          }

          .testimonial-track {
            display: flex;
            animation: scroll 30s linear infinite;
            gap: 40px;
          }

          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }

          .testimonial {
            flex-shrink: 0;
            width: 300px;
            padding: 20px;
            background: #12121a;
          }

          .testimonial-text {
            color: #888;
            font-style: italic;
            margin: 0 0 8px 0;
          }

          .testimonial-user {
            color: #444;
            font-size: 0.8rem;
            margin: 0;
          }

          .secret {
            padding: 60px 40px;
            text-align: center;
            background: linear-gradient(180deg, transparent, rgba(0, 255, 255, 0.05));
            overflow: hidden;
          }

          .secret-text {
            max-width: 500px;
            margin: 0 auto;
            color: #666;
            line-height: 2;
          }

          .secret-highlight {
            display: block;
            margin-top: 20px;
            color: #00ffff;
            font-family: 'Orbitron', monospace;
            font-size: 1.5rem;
            text-shadow: 0 0 20px #00ffff;
          }

          .footer {
            text-align: center;
            padding: 40px 20px;
            color: #444;
            font-size: 0.8rem;
          }

          .footer-small {
            font-size: 0.65rem;
            max-width: 500px;
            margin: 16px auto 0;
            color: #333;
          }

          @media (max-width: 768px) {
            .hero-title {
              font-size: 2.5rem;
            }

            .price-current {
              font-size: 3rem;
            }

            .product {
              flex-direction: column;
            }
          }
        `}</style>
      </div>
    </>
  );
}
