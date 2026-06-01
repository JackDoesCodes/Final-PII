import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin() {
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, password }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message);
      navigate("/");
    } catch {
      setError("Error al conectar con el servidor");
    }
  }

  return (
    <div>
      <h2>Registrarse</h2>
      <input
        value={user}
        onChange={(e) => setUser(e.target.value)}
        placeholder="Usuario"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        type="password"
      />
      <button onClick={handleLogin}>Entrar</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Register;
