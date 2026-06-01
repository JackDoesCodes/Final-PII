import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  user: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "doctor", "patient"], required: true },
}, { collection: "usuarios" });

export default mongoose.model("User", userSchema);