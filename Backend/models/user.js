import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  userId: String,
  password: String,
});

export default mongoose.model("User", userSchema);
