/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Orbitron', 'monospace'],
        body: ['Noto Sans SC', 'sans-serif'],
      },
      colors: {
        nba: {
          bg: '#0a0a0f',
          card: '#12121a',
          border: '#1e1e2e',
          gold: '#e6a23c',
          'gold-light': '#f0c060',
          accent: '#1a1a2e',
        },
        /* Attribute bar color stops */
        attr: {
          low: '#ef4444',
          'low-alt': '#dc2626',
          mid: '#f59e0b',
          'mid-alt': '#d97706',
          good: '#eab308',
          'good-alt': '#ca8a04',
          elite: '#22c55e',
          'elite-alt': '#16a34a',
        }
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'stagger-fade': 'staggerFade 0.3s ease-out both',
        'spin-blur': 'spinBlur 0.15s ease-out both',
        'spin-stop': 'spinStop 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
        'float': 'float 3s ease-in-out infinite',
        /* New: upgrade animations */
        'shimmer': 'shimmer 4s ease-in-out infinite',
        'shake': 'shake 0.3s ease-out both',
        'particle-fly': 'particleFly 0.6s cubic-bezier(0,0.7,0.3,1) both',
        'court-drift': 'courtDrift 20s linear infinite',
        'ring-pulse': 'ringPulse 1.5s ease-in-out infinite',
        'badge-spin': 'badgeSpin 0.3s ease-out',
        'grid-glow': 'gridGlow 2s ease-in-out infinite',
        'legend-shine': 'legendShine 3s linear infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        pulseGlow: {
          '0%,100%': { boxShadow: '0 0 8px rgba(230,162,60,0.3)' },
          '50%': { boxShadow: '0 0 24px rgba(230,162,60,0.6)' }
        },
        staggerFade: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        spinBlur: {
          '0%': { filter: 'blur(0)', transform: 'scale(1)' },
          '100%': { filter: 'blur(1.5px)', transform: 'scale(0.85)' }
        },
        spinStop: {
          '0%': { filter: 'blur(1px)', transform: 'scale(0.85)' },
          '50%': { filter: 'blur(0.5px)' },
          '100%': { filter: 'blur(0)', transform: 'scale(1.1)' }
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        /* ---- New ---- */
        shimmer: {
          '0%': { transform: 'translateX(-100%) skewX(-15deg)' },
          '40%,60%': { transform: 'translateX(200%) skewX(-15deg)' },
          '100%': { transform: 'translateX(200%) skewX(-15deg)' }
        },
        shake: {
          '0%,100%': { transform: 'translateX(0)' },
          '10%,50%,90%': { transform: 'translateX(-3px)' },
          '30%,70%': { transform: 'translateX(3px)' }
        },
        particleFly: {
          '0%': { opacity: '1', transform: 'translate(-50%,-50%) scale(1)' },
          '100%': { opacity: '0', transform: 'translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.2)' }
        },
        courtDrift: {
          '0%': { transform: 'translateY(0) rotate(0deg)' },
          '100%': { transform: 'translateY(-40px) rotate(1deg)' }
        },
        ringPulse: {
          '0%,100%': { boxShadow: '0 0 12px currentColor, 0 0 24px currentColor' },
          '50%': { boxShadow: '0 0 20px currentColor, 0 0 40px currentColor' }
        },
        badgeSpin: {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '100%': { transform: 'rotate(15deg) scale(1.15)' }
        },
        gridGlow: {
          '0%,100%': { borderColor: 'rgba(230,162,60,0.3)' },
          '50%': { borderColor: 'rgba(230,162,60,0.6)' }
        },
        legendShine: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '100% 100%' }
        }
      },
      backgroundImage: {
        'court-lines': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 500'%3E%3Cpath d='M200 480 L200 20' stroke='rgba(255,255,255,0.03)' stroke-width='1' fill='none'/%3E%3Ccircle cx='200' cy='460' r='60' stroke='rgba(255,255,255,0.03)' stroke-width='1' fill='none'/%3E%3Cpath d='M80 460 A180 180 0 0 1 320 460' stroke='rgba(255,255,255,0.025)' stroke-width='1' fill='none'/%3E%3Cpath d='M50 460 A230 230 0 0 1 350 460' stroke='rgba(255,255,255,0.02)' stroke-width='1' fill='none'/%3E%3Cline x1='200' y1='460' x2='200' y2='460' stroke='rgba(255,255,255,0.05)' stroke-width='3'/%3E%3C/svg%3E\")",
      },
      backgroundSize: {
        'court': '400px 500px',
      }
    }
  },
  plugins: []
}

