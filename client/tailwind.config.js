/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#07080D",
        primaryLight: "#31385E",
        primaryLight2: "#151828",
        secondary: "#06E1E4",
      },
    },
  },
  plugins: [],
}

