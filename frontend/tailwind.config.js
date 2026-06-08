/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#38BDF8",
        softPink: "#F9A8D4",
        success: "#22C55E",
        warm: "#F5D0A9",
        ink: "#0F172A",
        cardDark: "#1E293B",
        accentDark: "#60A5FA",
        highlight: "#A78BFA"
      },
      boxShadow: {
        premium: "0 24px 80px rgba(15, 23, 42, 0.14)",
        glow: "0 18px 45px rgba(56, 189, 248, 0.22)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "sans-serif"]
      }
    }
  },
  plugins: []
};
