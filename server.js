import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import process from "process";
import bodyParser from "body-parser";

import { register, login } from "./controllers/authController.js";
import {
  registerDoctor,
  getUsers,
  updateUser,
  deleteUser,
  getAppointments as getAdminAppointments,
  updateAppointment as updateAdminAppointment,
  deleteAppointment,
} from "./controllers/adminController.js";
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  getDoctors,
} from "./controllers/appointmentController.js";

// Middlewares de verificacion de token de sesión y rol con el cual se ingresa al sistema
import verifyToken from "./middlewares/verifyToken.js";
import verifyRole from "./middlewares/verifyRole.js";

dotenv.config();
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.error("Error de conexion con mongo", error);
  }
}
connectDB();

const app = express();

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

/* ----------------------------- Autorización ------------------------------*/
// Ruta para registrarse como usuario/cliente
app.post("/api/auth/register", register);
// Ruta de logueo de usuario
app.post("/api/auth/login", login);

/* -------------------------------- Turnos -------------------------------- */
// Ruta para obtener una lista con los doctores
app.get("/api/doctors", verifyToken, getDoctors);
// Ruta para obtener una lista con los turnos del usuario
app.get("/api/appointments", verifyToken, getAppointments);
// Ruta para crear turnos
app.post("/api/create-appointment", verifyToken, createAppointment);
// Ruta para actualizar el estado de un turno a "cancelado"
app.patch("/api/update-appointment", verifyToken, updateAppointment);

/* -------------------------------- Admin -------------------------------- */
// Ruta para registrar un doctor.
app.post(
  "/api/admin/register-doctor",
  verifyToken,
  verifyRole("admin"),
  registerDoctor,
);
app.get("/api/admin/users", verifyToken, verifyRole("admin"), getUsers);
app.patch("/api/admin/users/:id", verifyToken, verifyRole("admin"), updateUser);
app.delete(
  "/api/admin/users/:id",
  verifyToken,
  verifyRole("admin"),
  deleteUser,
);
app.get(
  "/api/admin/appointments",
  verifyToken,
  verifyRole("admin"),
  getAdminAppointments,
);
app.patch(
  "/api/admin/appointments/:id",
  verifyToken,
  verifyRole("admin"),
  updateAdminAppointment,
);
app.delete(
  "/api/admin/appointments/:id",
  verifyToken,
  verifyRole("admin"),
  deleteAppointment,
);

export default app;
