/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Cormorant Garamond', 'serif'],
        body: ['Lato', 'sans-serif'],
      },
      colors: {
        'accent': '#d4af37',
        'accent-hover': '#e7c864',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
