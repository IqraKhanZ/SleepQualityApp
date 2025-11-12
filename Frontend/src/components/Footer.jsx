import React from "react";

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-night-200/40 bg-white/80 py-10 text-night-900 transition-colors duration-300 dark:border-white/10 dark:bg-night-900/80 dark:text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <h4 className="text-xl font-semibold">Contact Us</h4>
          <p className="text-sm text-slate-600 dark:text-slate-300">Email: <a href="mailto:iqrakhan30oct@gmail.com" className="font-medium text-aurora hover:underline">iqrakhan30oct@gmail.com</a></p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Reach us for feedback, ideas, or any issues you encounter.</p>
          <div className="mt-4 flex items-center gap-3 text-slate-500 dark:text-slate-300">
            <span className="text-sm">Socials:</span>
            <div className="flex gap-2 text-lg">
              <span>𝕏</span>
              <span>in</span>
              <span>ig</span>
            </div>
          </div>
        </div>
        <div className="max-w-xl text-sm text-slate-600 dark:text-slate-300">
          <p>
            This platform was created to help people build healthier sleep cycles through predictive analysis and actionable insights.
          </p>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-500">© {new Date().getFullYear()} SleepWise. All rights reserved.</p>
      </div>
    </footer>
  );
}
