/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#171123",
        primaryLight: "#271B36",
        primaryLight2: "#312244",
        secondary: "#54AB73",
      },
    },
  },
  plugins: [],
}

