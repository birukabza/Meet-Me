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
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-out': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        'slide-in': 'slide-in 0.4s ease-out',
        'slide-out': 'slide-out 0.4s ease-out',
      },
    },
  },
  plugins: [],
};
