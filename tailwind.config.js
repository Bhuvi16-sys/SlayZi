/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#0A0A0F",
          purple: "#7C3AED",
          pink: "#A855F7",
          light: "#C084FC",
          violet: "#4C1D95",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 25px rgba(124, 58, 237, 0.25)",
        "glow-strong": "0 0 40px rgba(124, 58, 237, 0.45)",
      },
    },
  },
  plugins: [],
}
