import request from "supertest";
import app from "../server.js";
import { describe, test, expect, afterAll } from "@jest/globals";
import mongoose from "mongoose";

describe("Auth routes", () => {
  test("POST /api/auth/login con credenciales inválidas devuelve 401", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ dni: "123", password: "malapassword" });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Credenciales inválidas");
  });

  test("POST /api/auth/login sin datos devuelve 400", async () => {
    const res = await request(app)
    .post("/api/auth/login")
    .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("DNI y contraseña requeridos");
  });

  afterAll(async () => {
    // cierra conexion con mongo para evitar advertencia de operacion asyncronica abierta en jest
    await mongoose.connection.close();
  });
});
