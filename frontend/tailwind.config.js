/** @type {import('tailwindcss').Config} */
import scrollbar from 'tailwind-scrollbar';

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#1e40af',
        dark: {
          DEFAULT: '#0f0f0f',
          lighter: '#272727',
          lightest: '#3f3f3f',
        }
      },
    },
  },
  plugins: [
    scrollbar,
  ],
} 