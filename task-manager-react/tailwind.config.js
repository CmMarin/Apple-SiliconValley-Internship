module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#ebf5ff",
          200: "#c3e0ff",
          300: "#9ccaff",
          400: "#74b5ff",
          500: "#4c9fff",
          600: "#1a7fff",
          700: "#0065e0",
          800: "#0052b3",
          900: "#003e87",
        },
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
}