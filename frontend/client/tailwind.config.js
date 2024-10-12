/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
      

        'navy': '#10375C',
        'orange': '#EB8317',
        'yellow': '#F3C623',
      },
    },
  },
  plugins: [],
}