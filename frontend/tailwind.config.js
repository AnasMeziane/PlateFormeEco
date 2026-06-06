/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F7F3ED',
        'cream-dark': '#EDE8DF',
        royal: {
          50:  '#EEF2FA',
          100: '#D5DEF2',
          200: '#ABBDE5',
          300: '#7A96D4',
          400: '#4A6FC0',
          500: '#1B3A6B',
          600: '#162F57',
          700: '#112444',
          800: '#0C1A31',
          900: '#070F1E',
        },
        gold: {
          50:  '#FFF8EC',
          100: '#FEEECE',
          200: '#FDD89A',
          300: '#FBBB55',
          400: '#F5A623',
          500: '#E8920A',
          600: '#C47506',
          700: '#9A5B05',
          800: '#714204',
          900: '#4A2B02',
        },
        dark: '#1A1A1A',
        'dark-card': '#222222',
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
        'gold': '0 4px 20px rgba(232, 146, 10, 0.3)',
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
