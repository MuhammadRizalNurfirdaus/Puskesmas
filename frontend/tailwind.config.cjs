/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefbf7',
          100: '#d7f6ea',
          200: '#b0ecd6',
          300: '#7dddbd',
          400: '#45c79e',
          500: '#1fad81',
          600: '#158a68',
          700: '#136f56',
          800: '#125846',
          900: '#0f483a'
        }
      }
    }
  },
  plugins: []
};
