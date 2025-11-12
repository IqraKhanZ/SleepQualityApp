import React, { useMemo } from "react";
import { motion } from "framer-motion";

const SCORE_BANDS = [
  { min: 1, max: 2, message: "😴 Very poor sleep. Your rest patterns seem highly irregular or insufficient. Try to prioritise rest and establish a consistent schedule." },
  { min: 2, max: 3, message: "🌙 Poor sleep quality. Your sleep is below the healthy range. Focus on building a calming bedtime routine to counter stress and late-night stimulation." },
  { min: 3, max: 4, message: "😕 Below average sleep. You're getting some rest, but inconsistency or lifestyle factors are affecting recovery. Tighten your sleep timing and reduce evening screen exposure." },
  { min: 4, max: 5, message: "🌤️ Slightly below average sleep. Your habits are fair, yet there is clear room for improvement, especially in routine consistency and activity levels." },
  { min: 5, max: 6, message: "🙂 Moderate sleep quality. You're doing okay, but modest tweaks, like heading to bed 30 minutes earlier or adding light exercise, could elevate your rest." },
  { min: 6, max: 7, message: "🌿 Fairly good sleep. You are close to an optimal range. Fine-tune diet, bedtime, or wake consistency to unlock even better recovery." },
  { min: 7, max: 8, message: "🌟 Good sleep. Healthy habits are in place. Keep your routine steady and consider mindfulness or recovery practices to raise the bar." },
  { min: 8, max: 9, message: "💪 Very good sleep. Your lifestyle strongly supports energy and recovery. Maintain your diet, activity, and bedtime rhythm, you're on the right track." },
  { min: 9, max: 10, message: "🏆 Excellent sleep quality! Consistent, restorative rest like yours drives better mood, focus, and long-term health. Keep up the great work." }
];

const IDEAL_RANGES = {
  minSteps: 8000,
  minCalories: 2500,
  idealActivity: new Set(["Medium", "High"]),
  idealDiet: new Set(["Healthy", "Medium"])
};

const GENERAL_ACTIONS = [
  "Stick to a consistent sleep schedule every day, even on weekends, to reinforce your sleep-wake rhythm (Mayo Clinic).",
  "Optimize your sleep space by keeping it cool, dark, quiet, and screen free before bed so you fall asleep faster (Harvard Health).",
  "Stay physically active with regular moderate exercise, which improves sleep quality and reduces disturbances (PMC).",
  "Limit heavy meals, caffeine, nicotine, and alcohol close to bedtime to avoid disrupting sleep architecture (Mayo Clinic).",
  "Wind down with relaxing rituals such as reading, light stretching, or meditation to lower stress before bed (NHS)."
];

function convertToMinutes(time) {
  if (!time || typeof time !== "string") {
    return null;
  }
  const [hours, minutes] = time.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }
  return hours * 60 + minutes;
}

function normaliseAnswer(value) {
  if (typeof value === "string") {
    return value.trim().toLowerCase();
  }
  if (typeof value === "boolean") {
    return value ? "yes" : "no";
  }
  return "";
}

function pickScoreMessage(score) {
  if (!Number.isFinite(score)) {
    return null;
  }

  const band = SCORE_BANDS.find((range, index) => {
    const isLast = index === SCORE_BANDS.length - 1;
    if (isLast) {
      return score >= range.min && score <= range.max;
    }
    return score >= range.min && score < range.max;
  });

  return band?.message ?? null;
}

export function interpretSleepQuality(data) {
  if (!data) {
    return {
      message: null,
      recommendations: []
    };
  }

  const score = typeof data.sleepQuality === "number" ? data.sleepQuality : Number(data.sleepQuality);
  const message = pickScoreMessage(score) ?? "We couldn't interpret the sleep score this time.";

  const recommendationSet = new Set();
  const pushRecommendation = (text) => {
    if (text) {
      recommendationSet.add(text);
    }
  };

  if (typeof data.dailySteps === "number" && data.dailySteps < IDEAL_RANGES.minSteps) {
    pushRecommendation("Increase your step count to around 8,000-10,000 per day to support better sleep recovery.");
  }

  if (typeof data.caloriesBurned === "number" && data.caloriesBurned < IDEAL_RANGES.minCalories) {
    pushRecommendation("Incorporate more movement or workouts so your daily energy expenditure reaches 2,500+ calories.");
  }

  if (data.dietaryHabits && !IDEAL_RANGES.idealDiet.has(data.dietaryHabits)) {
    pushRecommendation("Your diet seems less supportive of sleep - add fruits, vegetables, whole grains, and sources of magnesium or tryptophan to promote melatonin production.");
  }

  if (data.activityLevel && !IDEAL_RANGES.idealActivity.has(data.activityLevel)) {
    pushRecommendation("Try increasing your daily physical activity - aim for at least 30 minutes of moderate movement each day.");
  }

  const sleepDisorderAnswer = normaliseAnswer(data.sleepDisorders);
  if (sleepDisorderAnswer === "yes") {
    pushRecommendation("Since you indicated a sleep disorder, consider consulting a sleep specialist to address the underlying causes.");
  }

  const medicationAnswer = normaliseAnswer(data.medicationUsage);
  if (medicationAnswer === "yes") {
    pushRecommendation("Because you're using medication, check with your doctor whether it may affect your sleep cycles or timing.");
  }

  if (typeof data.age === "number") {
    if (data.age >= 50) {
      pushRecommendation("Because you're 50+, add calming pre-sleep rituals such as meditation or gentle stretching to promote deeper sleep.");
      pushRecommendation("Ensure your bedroom stays dark, quiet, and cool - sleep tends to become lighter with age.");
      pushRecommendation("Seek bright daylight exposure during the day and reduce blue-light exposure in the evening to support circadian rhythms.");
    } else {
      pushRecommendation("For your age group, consistent bed and wake times are key to sustaining strong sleep quality.");
    }
  }

  const bedtimeMinutes = convertToMinutes(data.bedtime);
  if (bedtimeMinutes !== null && bedtimeMinutes > 23 * 60 + 30) {
    pushRecommendation("Shift your bedtime closer to 22:00-23:00 to align with deeper restorative sleep cycles.");
  }

  const wakeMinutes = convertToMinutes(data.wakeupTime || data.wakeUpTime);
  if (wakeMinutes !== null && wakeMinutes > 7 * 60 + 30) {
    pushRecommendation("Try waking up before 07:30 and keep that schedule steady to reinforce your circadian rhythm.");
  }

  GENERAL_ACTIONS.forEach((action) => {
    const lowerAction = action.toLowerCase();
    const alreadyCovered = Array.from(recommendationSet).some((existing) => {
      const lowerExisting = existing.toLowerCase();
      return (
        (lowerExisting.includes("sleep schedule") && lowerAction.includes("sleep schedule")) ||
        ((lowerExisting.includes("exercise") || lowerExisting.includes("activity")) && (lowerAction.includes("exercise") || lowerAction.includes("activity"))) ||
        (lowerExisting.includes("meditation") && lowerAction.includes("meditation")) ||
        (lowerExisting.includes("screen") && lowerAction.includes("screen")) ||
        ((lowerExisting.includes("bedroom") || lowerExisting.includes("sleep space")) && (lowerAction.includes("bedroom") || lowerAction.includes("sleep space")))
      );
    });

    if (!alreadyCovered) {
      recommendationSet.add(action);
    }
  });

  return {
    message,
    recommendations: Array.from(recommendationSet)
  };
}

export default function SleepAnalysisResult({ score, submission }) {
  if (score == null || (typeof score === "number" && Number.isNaN(score))) {
    return null;
  }

  const numericScore = typeof score === "number" ? score : Number(score);
  const hasNumericScore = Number.isFinite(numericScore);
  const { message, recommendations } = useMemo(() => {
    const payload = submission ? { ...submission, sleepQuality: numericScore } : { sleepQuality: numericScore };
    return interpretSleepQuality(payload);
  }, [submission, numericScore]);
  const sentiment = hasNumericScore
    ? numericScore >= 7.5
      ? "🌟"
      : numericScore >= 6
        ? "✨"
        : "🌙"
    : "🌙";
  const displayScore = hasNumericScore ? numericScore : score;

  return (
    <motion.section
      id="analysis"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mx-auto my-16 max-w-4xl px-4"
    >
      <div className="rounded-3xl border border-night-200/40 bg-white/80 p-10 text-night-900 shadow-lg transition-colors duration-300 dark:border-white/10 dark:bg-white/10 dark:text-slate-100">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="text-4xl">{sentiment}</span>
          <h3 className="text-3xl font-semibold">Sleep Analysis Results</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">Here is what the model predicts based on your routine.</p>
        </div>

        <div className="mt-8 grid gap-6 rounded-3xl border border-night-200/40 bg-white p-6 shadow-md transition-colors dark:border-white/10 dark:bg-white/5">
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-300">
              Sleep Quality Score
            </span>
            <p className="text-5xl font-bold text-aurora">{displayScore}</p>
          </div>
          <div className="rounded-2xl bg-slate-100/80 p-4 text-left text-slate-700 transition-colors dark:bg-white/10 dark:text-slate-100">
            <p>{message || "We couldn't determine a personalised interpretation this time."}</p>
          </div>
        </div>
        {recommendations.length > 0 && (
          <div className="mt-8 rounded-3xl border border-emerald-300/50 bg-emerald-500/10 p-6 text-left text-slate-800 transition-colors dark:border-emerald-200/40 dark:bg-emerald-300/10 dark:text-emerald-100">
            <h4 className="text-lg font-semibold text-emerald-700 dark:text-emerald-200">Recommended Actions</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {recommendations.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="mt-1 text-emerald-500">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.section>
  );
}
