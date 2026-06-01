import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  user: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "doctor" },
  specialty: { type: String, required: true },
}, { collection: "usuarios" });

export default mongoose.model("Doctor", doctorSchema);