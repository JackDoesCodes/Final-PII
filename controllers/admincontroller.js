import bcrypt from "bcryptjs";
import userModel from "../models/User.js";
import doctorModel from "../models/Doctor.js";
import appointmentModel from "../models/appointment.js";

export async function registerDoctor(req, res) {
  const name = req.body.name.toLowerCase();
  const surname = req.body.surname.toLowerCase();
  const dni = req.body.dni;
  const password = req.body.password;
  const specialty = req.body.specialty;
  const role = "doctor";

  if (!/^\d+$/.test(dni)) {
    return res
      .status(400)
      .json({ message: "El DNI solo puede contener números." });
  }

  if (!name || !surname || !dni || !password || !specialty)
    return res.status(400).json({ message: "No pueden quedar campos vacíos." });

  try {
    const dbUser = await userModel.findOne({ dni });
    if (dbUser)
      return res
        .status(409)
        .json({ message: `El doctor o usuario con DNI ${dni} ya existe.` });

    const hashedPassword = await bcrypt.hash(password, 10);
    await doctorModel.create({
      name,
      surname,
      dni,
      password: hashedPassword,
      role,
      specialty,
    });

    res.status(201).json({ message: "Doctor registrado correctamente." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al registrar", error: error.message });
  }
}

export async function getUsers(req, res) {
  try {
    const users = await userModel.find({}, { password: 0 });
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener usuarios", error: error.message });
  }
}

export async function updateUser(req, res) {
  try {
    const updated = await userModel.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      select: "-password",
    });
    res.json(updated);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar usuario", error: error.message });
  }
}

export async function deleteUser(req, res) {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar usuario", error: error.message });
  }
}

export async function getAppointments(req, res) {
  try {
    const appointments = await appointmentModel
      .find()
      .populate("doctor", "name surname specialty");
    res.json(appointments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener turnos", error: error.message });
  }
}

export async function updateAppointment(req, res) {
  try {
    const updated = await appointmentModel
      .findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after" })
      .populate("doctor", "name specialty");
    res.json(updated);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar turno", error: error.message });
  }
}

export async function deleteAppointment(req, res) {
  try {
    await appointmentModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Turno eliminado" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar turno", error: error.message });
  }
}
