import express from "express";
import axios from "axios";
import SleepData from "../models/sleep_data.js"; // your Mongoose schema

const router = express.Router();

// 🧠 Helper functions
function convertToMinutes(timeStr) {
  // Convert "HH:MM" string to total minutes
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

function mapActivity(level) {
  const l = level.toLowerCase();
  if (l === "low") return -1;
  if (l === "medium") return 0;
  if (l === "high") return 1;
  throw new Error(`Invalid activityLevel value: ${level}`);
}

function mapDiet(diet) {
  const d = diet.toLowerCase();
  if (d === "unhealthy") return -1;
  if (d === "medium") return 0;
  if (d === "healthy") return 1;
  throw new Error(`Invalid dietaryHabits value: ${diet}`);
}

// 💤 Route: Submit sleep data + predict quality
router.post("/submit", async (req, res) => {
  try {
    const sleepData = req.body;

    // ✅ Convert "Yes"/"No" to boolean
    const sleepDisordersBool =
      sleepData.sleepDisorders?.toLowerCase() === "yes";
    const medicationUsageBool =
      sleepData.medicationUsage?.toLowerCase() === "yes";

    // ✅ Save user-friendly data in MongoDB
    const savedData = await SleepData.create({
      userId: sleepData.userId,
      gender: sleepData.gender,
      bedtime: sleepData.bedtime,
      wakeupTime: sleepData.wakeupTime,
      dailySteps: sleepData.dailySteps,
      caloriesBurned: sleepData.caloriesBurned,
      activityLevel: sleepData.activityLevel,
      dietaryHabits: sleepData.dietaryHabits,
      sleepDisorders: sleepDisordersBool,
      medicationUsage: medicationUsageBool,
    });

    // ✅ Prepare ML input
    const mlInput = {
      Age: sleepData.age,
      Gender: sleepData.gender.toLowerCase() === "male" ? 0 : 1,
      Bedtime: convertToMinutes(sleepData.bedtime),
      "Wake-up Time": convertToMinutes(sleepData.wakeupTime),
      "Daily Steps": sleepData.dailySteps,
      "Calories Burned": sleepData.caloriesBurned,
      "Physical Activity Level": mapActivity(sleepData.activityLevel),
      "Dietary Habits": mapDiet(sleepData.dietaryHabits),
      "Sleep Disorders": sleepDisordersBool ? 1 : 0,
      "Medication Usage": medicationUsageBool ? 1 : 0,
    };

    // ✅ Send to Flask API
    const response = await axios.post(
      "https://sleepqualityapp-backend-ml-flask.onrender.com/predict",
      mlInput
    );

    // ✅ Get model prediction
    const predictedQuality = response.data["Predicted Sleep Quality"];

    // ✅ Update MongoDB with prediction
    savedData.prediction = predictedQuality;
    await savedData.save();

    // ✅ Respond to frontend
    res.status(200).json({
      message: "✅ Sleep data saved and predicted successfully!",
      predictedSleepQuality: predictedQuality,
      savedEntry: savedData,
    });
  } catch (error) {
    console.error("❌ Error saving or predicting sleep data:", error);
    res.status(500).json({
      error: "Server error: could not process sleep data",
      details: error.message,
    });
  }
});

export default router;
