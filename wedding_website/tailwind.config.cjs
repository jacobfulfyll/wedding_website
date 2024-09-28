const { resolveProjectPath } = require('wasp/dev')
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    resolveProjectPath('./src/**/*.{js,jsx,ts,tsx}'),
  ],
  theme: {
    extend: {
      colors: {
        'forest': {
          DEFAULT: '#2C5F2D',
          light: '#97BC62',
          dark: '#1E3F20',
        },
        'offwhite': '#F5F5F5',
        'sky': {
          DEFAULT: '#89CFF0',
          light: '#B5E2FA',
          dark: '#5D9ECE',
        },
        'charcoal': {
          DEFAULT: '#36454F',
          light: 'rgba(54, 69, 79, 0.1)', // Low opacity version
        },
        'background': '#fdf8f2', // Updated background color
      },
      fontFamily: {
        'snell': ['Snell Roundhand', 'cursive'],
        'garamond': ['Cormorant Garamond', 'serif'],
        'pinyon': ['Pinyon Script', 'cursive'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
        '10xl': ['10rem', { lineHeight: '1' }],
      },
      boxShadow: {
        'elegant': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'hanging': '0 12px 20px -3px rgba(0, 0, 0, 0.3), 0 8px 16px -6px rgba(0, 0, 0, 0.25)',
      },
      backgroundImage: {
        'frame-gradient': 'radial-gradient(circle, #8B4513 0%, #5D3A1A 100%)',
      },
      width: {
        '80': '20rem',   // 320px
        '96': '24rem',   // 384px
        '112': '28rem',  // 448px
        '128': '32rem',  // 512px
        '160': '40rem',  // 640px
        '192': '48rem',  // 768px
        '224': '50rem',  // 896px
      },
      height: {
        '60': '15rem',   // 240px
        '72': '18rem',   // 288px
        '84': '21rem',   // 336px
        '96': '24rem',   // 384px
        '120': '30rem',  // 480px
        '144': '36rem',  // 576px
        '168': '38rem',  // 672px
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}