/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          surface: "#fdf9f4",
          text: "#2b1c14",
          muted: "#685d53",
          accent: "#d37b6f",
          accentDark: "#a54638",
          glow: "#ffe3d5"
        }
      },
      boxShadow: {
        focus: "0 20px 45px rgba(55, 30, 15, 0.15)"
      },
      borderRadius: {
        xl: "36px"
      }
    }
  },
  plugins: []
};
