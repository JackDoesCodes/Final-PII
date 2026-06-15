import appointmentModel from "../models/appointment.js";

export async function getAppointments(req, res) {
  try {
    const appointments = await appointmentModel
      .find({ patient: req.user.user })
      .populate("doctor", "name specialty");
    res.json(appointments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener turnos", error: error.message });
  }
}

export async function createAppointment(req, res) {
  const { doctor, date, time } = req.body;
  const patient = req.user.user;

  if (!doctor || !date || !time)
    return res.status(400).json({ message: "Todos los campos son requeridos" });

  try {
    await appointmentModel.create({
      doctor,
      patient,
      date,
      time,
      status: "pendiente",
    });
    res.status(201).json({ message: "Turno creado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear turno", error: error.message });
  }
}

export async function updateAppointment(req, res) {
  const { id, status } = req.body;
  try {
    await appointmentModel.findByIdAndUpdate(id, { status });
    res.json({ message: "Turno actualizado" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar turno", error: error.message });
  }
}

export async function getDoctors(req, res) {
  try {
    const doctors = await appointmentModel.db
      .model("Doctor")
      .find({ role: "doctor" }, { password: 0 });
    res.json(doctors);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener doctores", error: error.message });
  }
}

export async function getDoctorAppointments(req, res) {
  try {
    const appointments = await appointmentModel
      .find({ doctor: req.user.id })
      .populate("doctor", "name surname specialty");
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener turnos", error: error.message });
  }
}