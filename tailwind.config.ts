/**
 * Tailwind CSS Configuration
 * Design tokens for Copa dos Sons
 */

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Green (Gramado)
        'field': {
          50: '#e8fff2',
          100: '#c6f8dd',
          200: '#97efbf',
          300: '#63e59f',
          400: '#2fd97f',
          500: '#009c3b',
          600: '#008232',
          700: '#00672a',
          800: '#014f21',
          900: '#003a18',
        },
        // Secondary - Blue (Ação primária)
        'uniform': {
          50: '#edf2ff',
          100: '#d8e2ff',
          200: '#b6c9ff',
          300: '#91acff',
          400: '#668bff',
          500: '#002776',
          600: '#002060',
          700: '#00194b',
          800: '#001338',
          900: '#000d25',
        },
        // Gold highlights and rewards
        'gold': {
          50: '#fffbe6',
          100: '#fff6bf',
          200: '#ffef8a',
          300: '#ffe755',
          400: '#ffe126',
          500: '#ffdf00',
          600: '#e6c900',
          700: '#bfa700',
          800: '#988400',
          900: '#706100',
        },
        // Feedback - Success
        'success': {
          50: '#f2fff8',
          100: '#ddffec',
          500: '#00b248',
          600: '#00943c',
        },
        // Feedback - Error
        'error': {
          50: '#fff2f1',
          100: '#ffdedd',
          500: '#ff3b30',
          600: '#e22f24',
        },
        // Feedback - Warning
        'warning': {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#eab308',
          600: '#ca8a04',
        },
        // Neutral
        'neutral': {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      typography: {
        // Child-friendly typography
        DEFAULT: {
          css: {
            fontFamily: '"Comic Sans MS", "Segoe UI", system-ui, sans-serif',
          },
        },
      },
      fontSize: {
        xs: ['12px', '16px'],
        sm: ['14px', '20px'],
        base: ['16px', '24px'],
        lg: ['20px', '28px'],
        xl: ['24px', '32px'],
        '2xl': ['32px', '40px'],
        '3xl': ['40px', '48px'],
        '4xl': ['48px', '56px'],
      },
      fontFamily: {
        sans: ['"Nunito"', '"Baloo 2"', '"Segoe UI"', 'sans-serif'],
        display: ['"Fredoka"', '"Baloo 2"', '"Nunito"', 'cursive', 'sans-serif'],
      },
      borderRadius: {
        none: '0px',
        sm: '4px',
        base: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        full: '9999px',
      },
      boxShadow: {
        none: 'none',
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        base: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'button': '0 2px 8px rgba(0, 0, 0, 0.12)',
        'press': '0 8px 0 0 rgba(0, 0, 0, 0.2)',
        'card-physical': '0 8px 0 0 rgba(0, 0, 0, 0.15), 0 16px 24px rgba(0, 0, 0, 0.22)',
        'card-float': '0 22px 30px rgba(0, 0, 0, 0.32)',
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 1s infinite',
        'shake': 'shake 0.5s infinite',
        'slide-in': 'slide-in 0.3s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'holo-sweep': 'holo-sweep 2.2s linear infinite',
        'camera-shake': 'camera-shake 0.35s ease-in-out',
        'goal-pop': 'goal-pop 0.5s ease-out',
      },
      keyframes: {
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'holo-sweep': {
          '0%': { transform: 'translateX(-140%) rotate(25deg)' },
          '100%': { transform: 'translateX(180%) rotate(25deg)' },
        },
        'camera-shake': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '20%': { transform: 'translate3d(-6px, 2px, 0)' },
          '40%': { transform: 'translate3d(5px, -3px, 0)' },
          '60%': { transform: 'translate3d(-4px, 2px, 0)' },
          '80%': { transform: 'translate3d(3px, -2px, 0)' },
        },
        'goal-pop': {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '70%': { transform: 'scale(1.08)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
