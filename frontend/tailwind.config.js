module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // Enable dark mode
  theme: {
    extend: {
      colors: {
        'primary-gradient': 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        'secondary-gradient': 'linear-gradient(135deg, #f472b6, #db2777)',
        'bot-message-bg': '#f1f5f9',
        'user-message-bg': '#818cf8',
        'chat-bg': '#f8fafc',
        'bg-color': '#ffffff',
        'text-primary': '#1e293b',
        'text-secondary': '#64748b',
        'border-color': '#e2e8f0',
      }
    },
  },
  plugins: [],
}