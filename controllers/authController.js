import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import process from "process";
import userModel from "../models/User.js";

export async function register(req, res) {
  console.log("body:", req.body);
  const name = req.body.name.toLowerCase();
  const surname = req.body.surname.toLowerCase();
  const dni = req.body.dni;
  const password = req.body.password;
  const role = "patient";

  if (!name || !surname || !dni || !password)
    return res.status(400).json({ message: "No pueden quedar campos vacíos." });

  try {
    const dbUser = await userModel.findOne({ dni });
    if (dbUser)
      return res
        .status(409)
        .json({ message: `El usuario con DNI ${dni} ya existe.` });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      name,
      surname,
      dni,
      password: hashedPassword,
      role,
    });

    const token = jwt.sign(
      { id: newUser._id, user: newUser.name, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" },
    );

    res
      .status(201)
      .json({ message: "Usuario registrado correctamente", token });
  } catch (error) {
    console.log("Error completo:", error);
    res
      .status(500)
      .json({ message: "Error al registrar", error: error.message });
  }
}

export async function login(req, res) {
  const dni = req.body.dni;
  const password = req.body.password;

  if (!dni || !password)
    return res.status(400).json({ message: "DNI y contraseña requeridos" });

  try {
    const dbUser = await userModel.findOne({ dni });
    if (!dbUser)
      return res.status(401).json({ message: "Credenciales inválidas" });

    const validPassword = await bcrypt.compare(password, dbUser.password);
    if (!validPassword)
      return res.status(401).json({ message: "Credenciales inválidas" });

    const token = jwt.sign(
      { id: dbUser._id, user: dbUser.name, role: dbUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" },
    );

    res.json({ token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al iniciar sesión", error: error.message });
  }
}
