import express from "express";
import axios from "axios";
import SleepData from "../models/sleep_data.js";

const router = express.Router();

/* -------------------- Helper Functions -------------------- */

function convertToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

function mapActivity(level) {
  if (!level) return 0;
  const l = level.toLowerCase();
  if (l === "low") return -1;
  if (l === "medium") return 0;
  if (l === "high") return 1;
  return 0;
}

function mapDiet(diet) {
  if (!diet) return 0;
  const d = diet.toLowerCase();
  if (d === "unhealthy") return -1;
  if (d === "medium") return 0;
  if (d === "healthy") return 1;
  return 0;
}

/* -------------------- Route -------------------- */

router.post("/submit", async (req, res) => {
  try {
    console.log("📥 REQ BODY RECEIVED:", req.body);

    const {
      age,
      gender,
      bedtime,
      wakeupTime,
      dailySteps,
      caloriesBurned,
      activityLevel,
      dietaryHabits,
      sleepDisorders,
      medicationUsage,
      userId
    } = req.body;

    // ✅ Basic validation check
    if (
      !gender ||
      !bedtime ||
      !wakeupTime ||
      dailySteps === undefined ||
      caloriesBurned === undefined ||
      !activityLevel ||
      !dietaryHabits
    ) {
      return res.status(400).json({
        error: "Missing required fields",
        received: req.body
      });
    }

    // ✅ Safe boolean handling (works for boolean OR "Yes"/"No")
    const sleepDisordersBool =
      typeof sleepDisorders === "string"
        ? sleepDisorders.toLowerCase() === "yes"
        : Boolean(sleepDisorders);

    const medicationUsageBool =
      typeof medicationUsage === "string"
        ? medicationUsage.toLowerCase() === "yes"
        : Boolean(medicationUsage);

    /* -------------------- Save to MongoDB -------------------- */

    const savedData = await SleepData.create({
      userId,
      age,
      gender,
      bedtime,
      wakeupTime,
      dailySteps,
      caloriesBurned,
      activityLevel,
      dietaryHabits,
      sleepDisorders: sleepDisordersBool,
      medicationUsage: medicationUsageBool
    });

    /* -------------------- Prepare ML Input -------------------- */

    const mlInput = {
      Age: age,
      Gender: gender.toLowerCase() === "male" ? 0 : 1,
      Bedtime: convertToMinutes(bedtime),
      "Wake-up Time": convertToMinutes(wakeupTime),
      "Daily Steps": dailySteps,
      "Calories Burned": caloriesBurned,
      "Physical Activity Level": mapActivity(activityLevel),
      "Dietary Habits": mapDiet(dietaryHabits),
      "Sleep Disorders": sleepDisordersBool ? 1 : 0,
      "Medication Usage": medicationUsageBool ? 1 : 0
    };

    /* -------------------- Call Flask ML API -------------------- */

    const response = await axios.post(
      "https://sleepqualityapp-backend-ml-flask.onrender.com/predict",
      mlInput
    );

    const predictedQuality =
      response?.data?.["Predicted Sleep Quality"];

    /* -------------------- Update DB with Prediction -------------------- */

    savedData.prediction = predictedQuality;
    await savedData.save();

    /* -------------------- Send Response -------------------- */

    res.status(200).json({
      message: "✅ Sleep data saved and predicted successfully!",
      predictedSleepQuality: predictedQuality,
      savedEntry: savedData
    });

  } catch (error) {
    console.error("❌ Error saving or predicting sleep data:", error);

    res.status(500).json({
      error: "Server error: could not process sleep data",
      details: error.message
    });
  }
});

export default router;
