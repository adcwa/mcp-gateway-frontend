/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f5f9ff',
          100: '#edf4ff',
          200: '#d6e4ff',
          300: '#a6c8ff',
          400: '#75a8ff',
          500: '#0071e3', // Apple blue
          600: '#0058a3',
          700: '#00438a',
          800: '#002c5c',
          900: '#00172e',
        },
        gray: {
          50: '#f9f9f9',
          100: '#f3f3f3',
          200: '#e6e6e6',
          300: '#dddddd',
          400: '#cccccc',
          500: '#999999',
          600: '#666666',
          700: '#444444',
          800: '#1d1d1f', // Apple dark gray
          900: '#000000',
        },
      },
      boxShadow: {
        'apple': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'apple-hover': '0 8px 24px rgba(0, 0, 0, 0.16)',
      },
      borderRadius: {
        'apple': '12px',
      }
    },
  },
  plugins: [],
} 