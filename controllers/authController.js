import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import process from "process";
import userModel from "../models/User.js";

export async function register(req, res) {
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
    const newUser = await userModel.create({
      user,
      password: hashedPassword,
      role,
    });

    const token = jwt.sign(
      { id: newUser._id, user: newUser.user, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" },
    );

    res
      .status(201)
      .json({ message: "Usuario registrado correctamente", token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al registrar", error: error.message });
  }
}

export async function login(req, res) {
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
}
