/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // Primary Colors (60%) - Dark to Light Blue
        primary: {
          dark: '#212A47',
          DEFAULT: '#3A4A7A',
          light: '#5066AD',
        },
        // Secondary Colors (30%) - Dark to Light Red
        secondary: {
          dark: '#872B2E',
          DEFAULT: '#8F3A3D',
          light: '#A64F52',
        },
        // Highlight Colors (10%) - Gold/Cream
        highlight: {
          dark: '#D79146',
          DEFAULT: '#E2A86D',
          light: '#EEC69B',
        },
      },
      backgroundImage: {
        // Gradient backgrounds
        'gradient-primary': 'linear-gradient(135deg, #212A47 0%, #5066AD 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #872B2E 0%, #A64F52 100%)',
        'gradient-highlight': 'linear-gradient(135deg, #D79146 0%, #EEC69B 100%)',
        'gradient-primary-vertical': 'linear-gradient(180deg, #212A47 0%, #5066AD 100%)',
        'gradient-secondary-hover': 'linear-gradient(135deg, #A64F52 0%, #872B2E 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 20px rgba(215, 145, 70, 0.3)',
        'glow-red': '0 0 20px rgba(135, 43, 46, 0.4)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
