/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        koi: {
          pink: '#ff7597',
          rose: '#ff4d6d',
          blush: '#ffa6c1',
          lavender: '#c084fc',
          purple: '#7e22ce',
          twilight: '#1e1b4b',
          midnight: '#0f172a',
          starlight: '#e0e7ff',
          deep: '#090a16',
          moon: '#fef08a'
        }
      },
      fontFamily: {
        sans: ['"Nunito"', 'system-ui', '-apple-system', 'sans-serif'],
        handwriting: ['"Caveat"', '"Dancing Script"', 'cursive'],
        japanese: ['"Yuji Boku"', '"Zen Maru Gothic"', 'sans-serif']
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-reverse': 'floatRev 7s ease-in-out infinite',
        'heartbeat': 'heartbeat 1.2s ease-in-out infinite',
        'glow': 'glow 2.5s ease-in-out infinite alternate',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        floatRev: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(8px)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '15%': { transform: 'scale(1.2)' },
          '30%': { transform: 'scale(1.05)' },
          '45%': { transform: 'scale(1.28)' },
          '60%': { transform: 'scale(1.02)' },
        },
        glow: {
          '0%': { filter: 'drop-shadow(0 0 10px rgba(255, 117, 151, 0.4))' },
          '100%': { filter: 'drop-shadow(0 0 25px rgba(255, 117, 151, 0.9))' },
        },
        twinkle: {
          '0%, 100%': { opacity: 0.3, transform: 'scale(0.8)' },
          '50%': { opacity: 1, transform: 'scale(1.2)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
