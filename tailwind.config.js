/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'shrain-dark': '#101010',
        'shrain-purple': '#8A2BE2',
        'shrain-gold': '#FFD700',
        'shrain-light-gray': '#A0A0A0',
        'shrain-dark-gray': '#1F1F1F',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
};
