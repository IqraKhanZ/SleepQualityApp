import React, { useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Moon } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

const navLinks = [
  { label: "Home", section: "home" },
  { label: "Insights", section: "insights" },
  { label: "Contact", section: "contact" }
];

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleScroll = useCallback(
    (section) => (event) => {
      event.preventDefault();

      const scrollToSection = () => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      };

      if (location.pathname !== "/home") {
        navigate("/home");
        // Allow the /home layout to mount before scrolling.
        setTimeout(scrollToSection, 120);
      } else {
        scrollToSection();
      }
    },
    [location.pathname, navigate]
  );

  return (
    <header className="sticky top-0 z-50 border-b border-night-200/30 bg-white/80 backdrop-blur-lg transition-colors duration-300 dark:border-white/10 dark:bg-night-900/80">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-night-900 dark:text-white">
        <Link
          to="/home"
          className="flex items-center gap-2 text-2xl font-semibold text-night-900 transition hover:text-aurora dark:text-white"
        >
          <Moon className="h-7 w-7" aria-hidden="true" />
          <span>SleepWise</span>
        </Link>
        <div className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <button
              key={link.section}
              type="button"
              onClick={handleScroll(link.section)}
              className="rounded-full px-3 py-1 text-night-700 transition hover:text-aurora dark:text-slate-200"
            >
              {link.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={logout}
            className="rounded-full bg-night-900/10 px-4 py-2 text-sm font-semibold text-night-900 shadow-aurora transition hover:bg-aurora hover:text-night-900 dark:bg-white/10 dark:text-white"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}
