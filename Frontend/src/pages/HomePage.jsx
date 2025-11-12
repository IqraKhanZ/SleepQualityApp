import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar.jsx";
import HeroSection from "../components/HeroSection.jsx";
import SleepForm from "../components/SleepForm.jsx";
import SleepAnalysisResult from "../components/SleepAnalysisResult.jsx";
import InsightsSection from "../components/InsightsSection.jsx";
import SleepFacts from "../components/SleepFacts.jsx";
import Footer from "../components/Footer.jsx";

export default function HomePage() {
  const formRef = useRef(null);
  const [prediction, setPrediction] = useState(null);
  const [latestSubmission, setLatestSubmission] = useState(null);

  const handlePrediction = (value, submission) => {
    setPrediction(value);
    setLatestSubmission(submission);

    if (typeof window !== "undefined") {
      const scrollToAnalysis = () => {
        const analysisSection = document.getElementById("analysis");
        if (analysisSection) {
          analysisSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      };

      if (typeof window.requestAnimationFrame === "function") {
        window.requestAnimationFrame(scrollToAnalysis);
      } else {
        setTimeout(scrollToAnalysis, 0);
      }
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-50 text-night-900 transition-colors duration-500 dark:bg-night-gradient dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-25 dark:opacity-70">
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,255,0.25),_transparent_70%)]"
          animate={{ opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/circles.png')]"
          animate={{ backgroundPosition: ["0px 0px", "200px 200px", "0px 0px"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{ opacity: 0.1 }}
        />
      </div>
      <Navbar />
      <main>
        <HeroSection />
        <SleepForm onPrediction={handlePrediction} scrollRef={formRef} />
        <SleepAnalysisResult score={prediction} submission={latestSubmission} />
        <InsightsSection />
        <SleepFacts />
      </main>
      <Footer />
    </div>
  );
}
