/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Clean cream/white palette
        cream: '#FAFAFA',
        'cream-dark': '#F0F0F0',
        // Deep Navy Blue - Professional primary color
        navy: {
          50:  '#E8EDF5',
          100: '#C5D1E8',
          200: '#9EB3D9',
          300: '#7694CA',
          400: '#4E75BB',
          500: '#0F2A4A',  // Main deep navy
          600: '#0C2240',
          700: '#091A35',
          800: '#06122A',
          900: '#030A1F',
        },
        // Royal blue (kept for compatibility)
        royal: {
          50:  '#E8EDF5',
          100: '#C5D1E8',
          200: '#9EB3D9',
          300: '#7694CA',
          400: '#4E75BB',
          500: '#0F2A4A',
          600: '#0C2240',
          700: '#091A35',
          800: '#06122A',
          900: '#030A1F',
        },
        // Copper/Gold metallic - Sophisticated accent
        copper: {
          50:  '#FDF6F0',
          100: '#F9E8D9',
          200: '#F3D0B3',
          300: '#E8B58A',
          400: '#D4956A',  // Main copper accent
          500: '#B87A4D',
          600: '#9A6340',
          700: '#7C4D33',
          800: '#5E3826',
          900: '#40241A',
        },
        // Gold (kept for compatibility, mapped to copper tones)
        gold: {
          50:  '#FDF6F0',
          100: '#F9E8D9',
          200: '#F3D0B3',
          300: '#E8B58A',
          400: '#D4956A',
          500: '#B87A4D',
          600: '#9A6340',
          700: '#7C4D33',
          800: '#5E3826',
          900: '#40241A',
        },
        // Clean grays
        slate: {
          50:  '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
        dark: '#0F2A4A',  // Navy as primary dark
        'dark-card': '#162F57',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['7rem', { lineHeight: '1', letterSpacing: '-0.03em', fontWeight: '800' }],
        'display-lg': ['5rem', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '800' }],
        'display-md': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
        'display-sm': ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
      },
      borderRadius: {
        'pill': '999px',
      },
      boxShadow: {
        'luxury': '0 20px 60px rgba(0,0,0,0.08)',
        'luxury-lg': '0 40px 100px rgba(0,0,0,0.12)',
        'gold': '0 4px 20px rgba(212, 149, 106, 0.35)',
        'copper': '0 4px 20px rgba(212, 149, 106, 0.35)',
        'navy': '0 4px 20px rgba(15, 42, 74, 0.25)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
