import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterDoctor() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit() {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/admin/register-doctor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ← admin token
      },
      body: JSON.stringify({ user, password, specialty }),
    });

    const data = await res.json();
    setMessage(data.message);
  }
  
  function goBack(){
    navigate("/")
  }

  return (
    <div>
      <h2>Registrar Doctor</h2>
      <input
        placeholder="Usuario"
        onChange={(event) => setUser(event.target.value)}
      />
      <input
        placeholder="Contraseña"
        type="password"
        onChange={(event) => setPassword(event.target.value)}
      />
      <select onChange={(event) => setSpecialty(event.target.value)}>
        <option value="">--Selecciona una especialidad--</option>
        <option value="cardiologia">Cardiología</option>
        <option value="radiografia">Radiografía</option>
        <option value="urologia">Urología</option>
        <option value="pediatria">Pediatría</option>
        <option value="dermatologia">Dermatología</option>
        <option value="neurologia">Neurología</option>
        <option value="oftalmologia">Oftalmología</option>
        <option value="traumatologia">Traumatología</option>
        <option value="ginecologia">Ginecología</option>
        <option value="psiquiatria">Psiquiatría</option>
        <option value="endocrinologia">Endocrinología</option>
        <option value="gastroenterologia">Gastroenterología</option>
        <option value="neumologia">Neumología</option>
        <option value="medicina_general">Medicina General</option>
      </select>
      <button onClick={handleSubmit}>Registrar</button>
      {message && <p>{message}</p>}
      <button onClick={goBack}>Volver</button>
    </div>
  );
}
