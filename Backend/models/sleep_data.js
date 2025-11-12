 import mongoose from "mongoose";

const sleepDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Links this data to a User
    ref: "User",
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    required: true,
  },
  bedtime: {
    type: String,
    required: true,
  },
  wakeupTime: {
    type: String,
    required: true,
  },
  dailySteps: {
    type: Number,
    required: true,
  },
  caloriesBurned: {
    type: Number,
    required: true,
  },
  activityLevel: {
    type: String,
    enum: ["Low", "Medium", "High"],
    required: true,
  },
  dietaryHabits: {
    type: String,
    enum: ["Healthy", "Medium","Unhealthy"],
    required: true,
  },
  sleepDisorders: {
    type: Boolean,
    required: true,
  },
  medicationUsage: {
    type: Boolean,
    required: true,
  },
  prediction: {
    type: Number, // your ML model’s predicted sleep quality score
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("SleepData", sleepDataSchema);
