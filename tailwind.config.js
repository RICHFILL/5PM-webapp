/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0edf7',
          100: '#dbd5ed',
          200: '#b7abdb',
          300: '#9382c9',
          400: '#7a68b7',
          500: '#6255a4',
          600: '#4f4488',
          700: '#3c336c',
          800: '#292250',
          900: '#161134',
        },
        navy: {
          50: '#ebebf0',
          100: '#cdccdd',
          200: '#ababbf',
          300: '#8989a1',
          400: '#6e6e8c',
          500: '#2a2551',
          600: '#221e42',
          700: '#1a1733',
          800: '#121024',
          900: '#0a0915',
        },
        accent: {
          cyan: '#52c7e4',
          coral: '#ef4747',
          tangerine: '#f68c23',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
