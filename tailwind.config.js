/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      spacing: {
        '14': '3.5rem',
        '26': '6.5rem',
      },
      colors: {
        // 可以添加自定义颜色
      },
    },
  },
  plugins: [],
} 