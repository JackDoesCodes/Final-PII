import { useState } from "react";
import { useNavigate } from "react-router-dom";
import isologo from '../assets/isologo.png';

function Login() {
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin() {
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dni, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return setError(data.message);
      }
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch {
      setError("Error al conectar con el servidor");
    }
  }

  return (
    <div>
      <div id="header">
        <h1>Iniciar Sesión</h1>
        <img id="isologo" src={isologo} alt="Isologo" />
      </div>
      <div id="content">
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
        <button onClick={handleLogin}>Iniciar Sesión</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}

export default Login;
