import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import sleepRoutes from "./routes/sleepRoutes.js";

dotenv.config(); // ✅ Load env variables early

const app = express();

// ✅ Middleware
app.use(express.json());

// ✅ Enable CORS for local React frontend (http://localhost:5173)
app.use(cors({
  origin: "https://sleepqualityapp.netlify.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/sleep", sleepRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("🌙 SLEEPWISE backend is running...");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on 0.0.0.0:${PORT}`));

