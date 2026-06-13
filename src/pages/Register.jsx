import { useState } from "react";
import { useNavigate } from "react-router-dom";
import isologo from '../assets/isologo.png';

function Register() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleRegistry() {
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, surname, dni, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        setError(data.message);
      }
    } catch {
      setError("Error al conectar con el servidor");
    }
  }

  return (
    <div>
      <div id="header">
        <h1>Registrarse</h1>
        <img id="isologo" src={isologo} alt="Isologo" />
      </div>
      <div id="content">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre"
        />
        <input
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          placeholder="Apellido"
        />
        <input
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          placeholder="DNI"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          type="password"
        />
        <button onClick={handleRegistry}>Registrarse</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}

export default Register;
