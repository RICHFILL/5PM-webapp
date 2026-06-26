/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fef6ed',
          100: '#fdebd3',
          200: '#fbd7a7',
          300: '#f8c37b',
          400: '#f6af4f',
          500: '#f68c23',
          600: '#d9771e',
          700: '#b86218',
          800: '#9a4d13',
          900: '#7a380e',
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
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
