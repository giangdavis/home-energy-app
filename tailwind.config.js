/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'app-dark': '#1a1a1a',
        'app-gray': '#2a2a2a',
        'app-text': '#a0a0a0',
      },
    },
  },
  plugins: [],
}
