import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext.jsx";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="relative flex h-10 w-20 items-center rounded-full bg-night-900/10 p-1 backdrop-blur-md transition hover:bg-night-900/20 dark:bg-white/10 dark:hover:bg-white/20"
    >
      <motion.div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-night-900 ${
          isDark ? "bg-slate-50" : "bg-night-700 text-white"
        }`}
        layout
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
      >
        {isDark ? "🌙" : "☀️"}
      </motion.div>
    </button>
  );
}
