import React, { useMemo, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";

const INITIAL_VALUES = {
  age: "",
  gender: "Female",
  bedtime: "23:00",
  wakeupTime: "07:00",
  dailySteps: "",
  caloriesBurned: "",
  activityLevel: "Medium",
  dietaryHabits: "Healthy",
  sleepDisorders: false,
  medicationUsage: false
};

const INPUT_CLASSES = "rounded-2xl border border-night-300/40 bg-white/80 px-4 py-3 text-night-900 placeholder:text-slate-500 shadow-sm transition focus:border-aurora focus:outline-none focus:ring focus:ring-aurora/30 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-slate-400";
const SELECT_CLASSES = "rounded-2xl border border-night-300/40 bg-white/80 px-4 py-3 text-night-900 shadow-sm transition focus:border-aurora focus:outline-none focus:ring focus:ring-aurora/40 dark:border-white/10 dark:bg-white/10 dark:text-white";

export default function SleepForm({ onPrediction, scrollRef }) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token, user } = useAuth();
  const [prediction, setPrediction] = useState(null);

  const updateBooleanField = (name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const formattedPayload = useMemo(
    () => ({
      ...values,
      age: Number(values.age),
      dailySteps: Number(values.dailySteps),
      caloriesBurned: Number(values.caloriesBurned),
      // Convert booleans to the API's expected string values
      sleepDisorders: values.sleepDisorders ? "yes" : "no",
      medicationUsage: values.medicationUsage ? "yes" : "no",
      userId: user?._id || user?.id || null
    }),
    [values, user]
  );

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);
    try {
      console.log("\uD83E\uDDE0 Sending payload:", formattedPayload);
      const response = await axios.post("http://localhost:5000/api/sleep/submit", formattedPayload, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      const score = response?.data?.predictedSleepQuality ?? response?.data?.prediction ?? null;
      const numericScore = typeof score === "number" ? score : Number(score);
      if (!Number.isNaN(numericScore)) {
        setPrediction(numericScore);
        if (typeof onPrediction === "function") {
          const submissionSummary = {
            ...values,
            age: Number(values.age),
            dailySteps: Number(values.dailySteps),
            caloriesBurned: Number(values.caloriesBurned),
            sleepDisorders: values.sleepDisorders ? "Yes" : "No",
            medicationUsage: values.medicationUsage ? "Yes" : "No",
            sleepQuality: numericScore
          };
          onPrediction(numericScore, submissionSummary);
        }
      }
    } catch (err) {
      setError(err?.response?.data?.error || "Unable to fetch prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <section ref={scrollRef} className="relative mx-auto mt-12 max-w-5xl px-4" id="questionnaire">
      <motion.form
        layout
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="rounded-3xl border border-night-200/40 bg-white/80 p-8 text-night-900 shadow-lg backdrop-blur-xl transition-colors duration-300 dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
      >
        <div className="mb-8 flex flex-col gap-3 text-center">
          <h2 className="text-3xl font-semibold text-night-900 dark:text-white">Tell us about your sleep routine</h2>
          <p className="text-slate-600 dark:text-slate-200">
            Share your daily patterns so we can forecast your sleep quality and guide you toward healthier rest.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-night-700 dark:text-slate-200">
            Age
            <input
              name="age"
              type="number"
              min="0"
              className={INPUT_CLASSES}
              placeholder="e.g. 28"
              value={values.age}
              onChange={handleChange}
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-night-700 dark:text-slate-200">
            Gender
            <select name="gender" className={`${SELECT_CLASSES} tinted-select`} value={values.gender} onChange={handleChange}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm text-night-700 dark:text-slate-200">
            Bedtime
            <input
              type="time"
              name="bedtime"
              className={INPUT_CLASSES}
              value={values.bedtime}
              onChange={handleChange}
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-night-700 dark:text-slate-200">
            Wake-up Time
            <input
              type="time"
              name="wakeupTime"
              className={INPUT_CLASSES}
              value={values.wakeupTime}
              onChange={handleChange}
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-night-700 dark:text-slate-200">
            Daily Steps
            <input
              type="number"
              name="dailySteps"
              min="0"
              className={INPUT_CLASSES}
              placeholder="e.g. 8500"
              value={values.dailySteps}
              onChange={handleChange}
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-night-700 dark:text-slate-200">
            Calories Burned
            <input
              type="number"
              name="caloriesBurned"
              min="0"
              className={INPUT_CLASSES}
              placeholder="e.g. 2100"
              value={values.caloriesBurned}
              onChange={handleChange}
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-night-700 dark:text-slate-200">
            Physical Activity Level
            <select name="activityLevel" className={`${SELECT_CLASSES} tinted-select`} value={values.activityLevel} onChange={handleChange}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm text-night-700 dark:text-slate-200">
            Dietary Habits
            <select name="dietaryHabits" className={`${SELECT_CLASSES} tinted-select`} value={values.dietaryHabits} onChange={handleChange}>
              <option value="Unhealthy">Unhealthy</option>
              <option value="Medium">Medium</option>
              <option value="Healthy">Healthy</option>
            </select>
          </label>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <fieldset className="rounded-2xl border border-night-200/40 bg-white/70 px-4 py-3 transition-colors dark:border-white/10 dark:bg-white/5">
            <legend className="text-sm font-medium text-night-700 dark:text-slate-200">Sleep Disorders</legend>
            <div className="mt-3 flex gap-4">
              {[true, false].map((option) => (
                <label key={`sleepDisorders-${option}`} className="flex items-center gap-2 text-sm text-night-700 dark:text-slate-200">
                  <input
                    type="radio"
                    name="sleepDisorders"
                    value={option ? "yes" : "no"}
                    checked={values.sleepDisorders === option}
                    onChange={() => updateBooleanField("sleepDisorders", option)}
                    className="h-4 w-4 accent-aurora"
                  />
                  {option ? "Yes" : "No"}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="rounded-2xl border border-night-200/40 bg-white/70 px-4 py-3 transition-colors dark:border-white/10 dark:bg-white/5">
            <legend className="text-sm font-medium text-night-700 dark:text-slate-200">Medication Usage</legend>
            <div className="mt-3 flex gap-4">
              {[true, false].map((option) => (
                <label key={`medicationUsage-${option}`} className="flex items-center gap-2 text-sm text-night-700 dark:text-slate-200">
                  <input
                    type="radio"
                    name="medicationUsage"
                    value={option ? "yes" : "no"}
                    checked={values.medicationUsage === option}
                    onChange={() => updateBooleanField("medicationUsage", option)}
                    className="h-4 w-4 accent-aurora"
                  />
                  {option ? "Yes" : "No"}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-200">
            {error}
          </div>
        )}

    

        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-full bg-aurora px-10 py-3 text-lg font-semibold text-night-900 shadow-aurora transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Predicting..." : "Predict Sleep Quality"}
          </button>
        </div>
      </motion.form>
    </section>
  );
}
