import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";

export default function SignupPage() {
  const { signup, isLoading, error } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await signup(form);
    } catch (err) {
      // Error handling is centralized in AuthContext; no action needed here.
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-night-900 transition-colors duration-500 dark:bg-night-gradient dark:text-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md rounded-3xl border border-night-200/40 bg-white/80 p-10 text-center text-night-900 shadow-lg backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-white/10 dark:text-white"
      >
        <h1 className="text-3xl font-semibold">Join the SleepWise community</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Create your account to unlock personalized predictions.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5 text-left">
          <label className="flex flex-col gap-2 text-sm text-night-700 dark:text-slate-200">
            Name
            <input
              name="name"
              type="text"
              required
              placeholder="Your name"
              className="rounded-2xl border border-night-200/40 bg-white/80 px-4 py-3 text-night-900 placeholder:text-slate-500 focus:border-aurora focus:outline-none focus:ring focus:ring-aurora/30 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-slate-400"
              value={form.name}
              onChange={handleChange}
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-night-700 dark:text-slate-200">
            Email
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="rounded-2xl border border-night-200/40 bg-white/80 px-4 py-3 text-night-900 placeholder:text-slate-500 focus:border-aurora focus:outline-none focus:ring focus:ring-aurora/30 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-slate-400"
              value={form.email}
              onChange={handleChange}
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-night-700 dark:text-slate-200">
            Password
            <input
              name="password"
              type="password"
              required
              placeholder="Create a strong password"
              className="rounded-2xl border border-night-200/40 bg-white/80 px-4 py-3 text-night-900 placeholder:text-slate-500 focus:border-aurora focus:outline-none focus:ring focus:ring-aurora/30 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-slate-400"
              value={form.password}
              onChange={handleChange}
            />
          </label>
          {error && (
            <p className="rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-200">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full bg-aurora px-6 py-3 text-lg font-semibold text-night-900 shadow-aurora transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-6 text-sm text-slate-600 dark:text-slate-300">
          Already have an account? {" "}
          <Link to="/login" className="text-aurora hover:text-night-900 dark:hover:text-white">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
