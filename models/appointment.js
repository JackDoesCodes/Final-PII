import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    doctor: {type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    patient: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ["pendiente", "cancelado", "revisado"], default: "pendiente", required: true },
  },
  { collection: "turnos", versionKey: false },
);

export default mongoose.model("Appointment", appointmentSchema);
