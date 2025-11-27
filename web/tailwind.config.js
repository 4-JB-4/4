/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './public/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        'orb-black': '#0a0a0f',
        'orb-black-light': '#12121a',
        'orb-black-lighter': '#1a1a2e',
        'orb-cyan': '#00ffff',
        'orb-cyan-dark': '#00cccc',
        'orb-purple': '#9b59b6',
        'orb-gold': '#ffd700',
        'orb-red': '#e74c3c',
        'orb-green': '#2ecc71',
        'orb-blue': '#3498db',
        'orb-orange': '#e67e22',
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['Rajdhani', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff',
        'glow-cyan-sm': '0 0 5px #00ffff, 0 0 10px #00ffff',
        'glow-purple': '0 0 10px #9b59b6, 0 0 20px #9b59b6',
        'glow-gold': '0 0 10px #ffd700, 0 0 20px #ffd700',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px #00ffff, 0 0 10px #00ffff' },
          '50%': { boxShadow: '0 0 20px #00ffff, 0 0 40px #00ffff' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
