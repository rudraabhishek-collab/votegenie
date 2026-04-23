/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      colors: {
        accent: { DEFAULT: '#6366f1', dark: '#4338ca', light: '#eef2ff' },
      },
      animation: {
        'float':        'float 20s ease-in-out infinite',
        'float-slow':   'float 28s ease-in-out infinite reverse',
        'float-med':    'float 24s ease-in-out infinite 4s',
        'pulse-dot':    'pulseDot 2s ease-in-out infinite',
        'fade-up':      'fadeUp 0.7s cubic-bezier(0.34,1.56,0.64,1) both',
        'fade-in':      'fadeIn 0.5s ease both',
        'scale-in':     'scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
        'slide-right':  'slideRight 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
        'shimmer':      'shimmer 2.5s linear infinite',
        'spin-slow':    'spin 8s linear infinite',
        'border-spin':  'borderSpin 4s linear infinite',
        'glow-pulse':   'glowPulse 3s ease-in-out infinite',
        'bounce-soft':  'bounceSoft 2s ease-in-out infinite',
        'marquee':      'marquee 30s linear infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '33%':     { transform: 'translate(20px,-25px) scale(1.04)' },
          '66%':     { transform: 'translate(-15px,10px) scale(0.97)' },
        },
        pulseDot: {
          '0%,100%': { opacity:'1', transform:'scale(1)' },
          '50%':     { opacity:'0.5', transform:'scale(1.4)' },
        },
        fadeUp: {
          from: { opacity:'0', transform:'translateY(24px)' },
          to:   { opacity:'1', transform:'translateY(0)' },
        },
        fadeIn: {
          from: { opacity:'0' },
          to:   { opacity:'1' },
        },
        scaleIn: {
          from: { opacity:'0', transform:'scale(0.88)' },
          to:   { opacity:'1', transform:'scale(1)' },
        },
        slideRight: {
          from: { opacity:'0', transform:'translateX(-20px)' },
          to:   { opacity:'1', transform:'translateX(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        borderSpin: {
          '0%':   { '--angle':'0deg' },
          '100%': { '--angle':'360deg' },
        },
        glowPulse: {
          '0%,100%': { boxShadow:'0 0 20px rgba(99,102,241,0.3)' },
          '50%':     { boxShadow:'0 0 40px rgba(99,102,241,0.6), 0 0 80px rgba(139,92,246,0.3)' },
        },
        bounceSoft: {
          '0%,100%': { transform:'translateY(0)' },
          '50%':     { transform:'translateY(-6px)' },
        },
        marquee: {
          '0%':   { transform:'translateX(0)' },
          '100%': { transform:'translateX(-50%)' },
        },
      },
      boxShadow: {
        'glow':       '0 4px 24px rgba(99,102,241,0.3)',
        'glow-lg':    '0 8px 48px rgba(99,102,241,0.4)',
        'glow-xl':    '0 16px 80px rgba(99,102,241,0.5)',
        'glow-pink':  '0 4px 24px rgba(236,72,153,0.35)',
        'card':       '0 1px 2px rgba(0,0,0,0.02),0 4px 12px rgba(99,102,241,0.04),0 8px 24px rgba(99,102,241,0.03)',
        'card-hover': '0 4px 8px rgba(0,0,0,0.04),0 16px 48px rgba(99,102,241,0.14),0 32px 80px rgba(99,102,241,0.08)',
        'card-xl':    '0 8px 16px rgba(0,0,0,0.06),0 24px 64px rgba(99,102,241,0.18),0 48px 120px rgba(99,102,241,0.1)',
        'modal':      '0 8px 16px rgba(0,0,0,0.08),0 24px 64px rgba(99,102,241,0.2),0 48px 120px rgba(99,102,241,0.12)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.15)',
      },
      backgroundSize: {
        'shimmer': '200% auto',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34,1.56,0.64,1)',
        'smooth': 'cubic-bezier(0.4,0,0.2,1)',
      },
    },
  },
  plugins: [],
}
