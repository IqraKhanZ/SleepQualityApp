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

    const body = req.body;

    // ✅ Map frontend fields to backend fields
    const mappedData = {
      userId: body.userId,
      age: Number(body.Age),
      gender: body.Gender,
      bedtime: body.Bedtime,
      wakeupTime: body["Wake-up Time"],
      dailySteps: Number(body["Daily Steps"]),
      caloriesBurned: Number(body["Calories Burned"]),
      activityLevel: body["Physical Activity Level"],
      dietaryHabits: body["Dietary Habits"],
      sleepDisorders: Boolean(body["Sleep Disorders"]),
      medicationUsage: Boolean(body["Medication Usage"])
    };

    // ✅ Validate required fields
    if (
      !mappedData.gender ||
      !mappedData.bedtime ||
      !mappedData.wakeupTime ||
      mappedData.dailySteps === undefined ||
      mappedData.caloriesBurned === undefined ||
      !mappedData.activityLevel ||
      !mappedData.dietaryHabits
    ) {
      return res.status(400).json({
        error: "Missing required fields after mapping",
        received: mappedData
      });
    }

    // ✅ Save to MongoDB
    const savedData = await SleepData.create(mappedData);

    // ✅ Prepare ML input (already correct format from frontend)
    const mlInput = {
      Age: mappedData.age,
      Gender: mappedData.gender.toLowerCase() === "male" ? 0 : 1,
      Bedtime: convertToMinutes(mappedData.bedtime),
      "Wake-up Time": convertToMinutes(mappedData.wakeupTime),
      "Daily Steps": mappedData.dailySteps,
      "Calories Burned": mappedData.caloriesBurned,
      "Physical Activity Level": mapActivity(mappedData.activityLevel),
      "Dietary Habits": mapDiet(mappedData.dietaryHabits),
      "Sleep Disorders": mappedData.sleepDisorders ? 1 : 0,
      "Medication Usage": mappedData.medicationUsage ? 1 : 0
    };

    const response = await axios.post(
      "https://sleepqualityapp-backend-ml-flask.onrender.com/predict",
      mlInput
    );

    const predictedQuality =
      response?.data?.["Predicted Sleep Quality"];

    savedData.prediction = predictedQuality;
    await savedData.save();

    res.status(200).json({
      message: "✅ Sleep data saved and predicted successfully!",
      predictedSleepQuality: predictedQuality,
      savedEntry: savedData
    });

  } catch (error) {
    console.error("❌ Error saving or predicting sleep data:", error);
    res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
});
export default router;
