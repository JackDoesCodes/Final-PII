import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    dni: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "doctor" },
    specialty: { type: String, required: true },
  },
  { collection: "usuarios" },
);

export default mongoose.model("Doctor", doctorSchema);
