/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['DM Serif Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        'studio-bg': '#FFFDF6',
        'studio-primary': '#36454F',
        'studio-accent': '#D2B48C',
        'studio-button': '#468289',
        'studio-button-hover': '#36454F',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
