import React from "react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 pb-16 pt-24 text-center"
      >
        <h1 className="text-4xl font-bold leading-tight text-night-900 dark:text-white sm:text-5xl md:text-6xl">
          Sleep smarter. Wake brighter.
        </h1>
        <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-200">
          This app helps users improve their sleep quality through data-driven insights, personalized predictions, and scientific analysis.
        </p>
        <span className="rounded-full bg-aurora/10 px-6 py-2 text-sm font-semibold uppercase tracking-wide text-aurora dark:bg-white/10">
          Backed by predictive analytics & wellness science
        </span>
      </motion.div>
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
        <div className="absolute -top-40 -right-24 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-10 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
      </div>
    </section>
  );
}
