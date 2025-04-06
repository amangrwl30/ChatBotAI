// const colors = require('tailwindcss/colors')

const colors = require("tailwindcss/colors");


module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
      darkMode: 'class', // Enable dark mode
  theme: {
    extend: {
      colors:{
        'zinc-1000': 'rgb(21, 16, 31)',
        'gray-1000':'rgb(255, 255, 255)',
        'gray-1300':'rgba(138, 124, 184, 0.2)',
        'zinc-1100':'rgba(13, 9, 21, 0.8)',
        'gray-1100':'rgb(30,34,46)',
        'gray-1200':'#1e222ee6'
      }
    },
  },
  plugins: [],
}