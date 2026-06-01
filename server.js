import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import process from "process";
import bodyParser from "body-parser";

import userModel from "./models/user.js";
import doctorModel from "./models/doctor.js";
import appointmentModel from "./models/appointment.js";

// Middlewares de verificacion de token de sesión y rol con el cual se ingresa al sistema
import verifyToken from "./middlewares/verifyToken.js";
import verifyRole from "./middlewares/verifyRole.js";

dotenv.config();
try {
  await mongoose.connect(process.env.MONGO_URI);
} catch (error) {
  console.error("Error de conexion con mongo", error);
}

const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta para testear estado del servidor
app.get("/api/test-server", (req, res) => {
  res.send("Server ok");
});

// Ruta para testear estado de la base de datos
app.get("/api/test-db", async (req, res) => {
  try {
    // Tambien testea el delay de la conexión con '.ping()';
    await mongoose.connection.db.admin().ping();
    res.status(200).json({ status: "success", message: "Database ok" });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Conexión fallida",
      error: error.message,
    });
  }
});

app.get("/api/appointments", verifyToken, async (req, res) => {
  try {
    const appointments = await appointmentModel
      .find({ patient: req.user.user })
      .populate("doctor", "user specialty");
    res.json(appointments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener turnos", error: error.message });
  }
});

// Ruta para obtener una lista con los doctores
app.get("/api/doctors", verifyToken, async (req, res) => {
  try {
    const doctors = await doctorModel.find({ role: "doctor" }, { password: 0 });
    res.json(doctors);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener doctores", error: error.message });
  }
});

// Ruta pública para registrarse como usuario
app.post("/api/auth/register", async (req, res) => {
  const user = req.body.user.toLowerCase();
  const password = req.body.password;
  const role = "patient";

  if (!user || !password)
    return res.status(400).json({ message: "usuario y contraseña requeridos" });

  try {
    const dbUser = await userModel.findOne({ user });
    if (dbUser)
      return res.status(409).json({ message: "El usuario ya existe" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.create({ user, password: hashedPassword, role });

    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al registrar", error: error.message });
  }
});

// Ruta para registrar un doctor. Solo accesible con rol de admin
app.post(
  "/api/admin/register-doctor",
  verifyToken,
  verifyRole("admin"),
  async (req, res) => {
    const user = req.body.user.toLowerCase();
    const password = req.body.password;
    const specialty = req.body.specialty;
    const role = "doctor";

    if (!user || !password)
      return res
        .status(400)
        .json({ message: "usuario y contraseña requeridos" });

    try {
      const dbUser = await userModel.findOne({ user });
      if (dbUser)
        return res.status(409).json({ message: "El doctor ya existe" });

      const hashedPassword = await bcrypt.hash(password, 10);
      await doctorModel.create({
        user,
        password: hashedPassword,
        role,
        specialty,
      });

      res.status(201).json({ message: "Doctor registrado correctamente" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al registrar", error: error.message });
    }
  },
);

// Ruta de logeo de usuario
app.post("/api/auth/login", async (req, res) => {
  const user = req.body.user;
  const password = req.body.password;

  if (!user || !password)
    return res.status(400).json({ message: "Usuario y contraseña requeridos" });

  try {
    const dbUser = await userModel.findOne({ user });
    if (!dbUser)
      return res.status(401).json({ message: "Credenciales inválidas" });

    const validPassword = await bcrypt.compare(password, dbUser.password);
    if (!validPassword)
      return res.status(401).json({ message: "Credenciales inválidas" });

    const token = jwt.sign(
      { id: dbUser._id, user: dbUser.user, role: dbUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" },
    );

    res.json({ token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al iniciar sesión", error: error.message });
  }
});

// Ruta para crear turnos
app.post("/api/create-appointment", verifyToken, async (req, res) => {
  const { doctor, patient, date, time, status } = req.body;

  if (!doctor || !patient || !date || !time) {
    return res.status(400).json({ message: "No pueden quedar campos vacíos." });
  }

  try {
    const existingAppointment = await appointmentModel.findOne({
      doctor,
      date,
      time,
    });
    if (existingAppointment) {
      return res.status(409).json({
        message:
          "El profesional ya tiene un turno reservado para esa fecha y hora.",
      });
    }

    await appointmentModel.create({
      doctor,
      patient,
      date,
      time,
      status,
    });

    res.status(201).json({ message: "Turno reservado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear el turno", error: error.message });
  }
});

// Ruta para actualizar el estado de un turno a "cancelado"
app.patch("/api/update-appointment", verifyToken, async (req, res) => {
  const id = req.body.id;
  const status = req.body.status;

  console.log("id:", id, "status:", status);
  try {
    await appointmentModel.findByIdAndUpdate(id, { status });
    res.json({ message: "Turno actualizado" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar turno", error: error.message });
  }
});

// Acceso con rol de admin
app.get("/api/admin/panel", verifyToken, verifyRole("admin"), (req, res) => {
  res.json({ message: "Panel de admin" });
});

// // Acceso con rol de admin o doctor
// app.get(
//   "/api/turnos",
//   verifyToken,
//   verifyRole("admin", "doctor"),
//   (req, res) => {
//     res.json({ message: "Lista de turnos" });
//   },
// );

// // Acceso con cualquier rol
// app.get("/api/perfil", verifyToken, (req, res) => {
//   res.json({ user: req.user });
// });

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
