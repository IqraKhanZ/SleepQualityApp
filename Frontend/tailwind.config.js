/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        night: {
          900: "#0a0724",
          800: "#131040",
          700: "#1b1c58",
          600: "#262a6e"
        },
        aurora: "#a855f7",
        stardust: "#94a3b8"
      },
      backgroundImage: {
        "night-gradient": "radial-gradient(circle at 20% 20%, rgba(148, 163, 255, 0.25), transparent 45%), radial-gradient(circle at 80% 0%, rgba(199, 210, 254, 0.2), transparent 55%), linear-gradient(180deg, rgba(17, 24, 39, 0.95), rgba(10, 17, 35, 0.95))",
        "night-glow": "linear-gradient(135deg, rgba(79, 70, 229, 0.2), rgba(236, 72, 153, 0.15))"
      },
      boxShadow: {
        glass: "0 25px 50px -12px rgba(59, 130, 246, 0.25)",
        aurora: "0 15px 45px -10px rgba(168, 85, 247, 0.45)"
      }
    }
  },
  plugins: []
};
