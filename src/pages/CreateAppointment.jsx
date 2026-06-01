import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function DoctorSelection({ value, onChange }) {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    // recuperacion de token para verificar permisos de lectura
    const token = localStorage.getItem("token");
    fetch("/api/doctors", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setDoctors(data);
      })
      .catch(() => console.error("Error al obtener doctores"));
  }, []);

  return (
    <div id="doctor_selector">
      <h2>Profesional</h2>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">--Selecciona al profesional--</option>
        {doctors.map((doctor) => (
          <option key={doctor._id} value={doctor._id}>
            {doctor.user} - {doctor.specialty}
          </option>
        ))}
      </select>
    </div>
  );
}

function DateSelection({ value, onChange }) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const maxDate = new Date(today);
  maxDate.setFullYear(today.getFullYear() + 1);

  const toInputFormat = (date) => date.toISOString().split("T")[0]; // YYYY-MM-DD

  return (
    <div id="date_selector">
      <h2>Fecha</h2>
      <input
        type="date"
        value={value}
        min={toInputFormat(tomorrow)}
        max={toInputFormat(maxDate)}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function TimeSelection({ value, onChange }) {
  const times = [];
  for (let hour = 10; hour < 18; hour++) {
    times.push(`${String(hour).padStart(2, "0")}:00`);
    times.push(`${String(hour).padStart(2, "0")}:30`);
  }
  times.push("18:00");

  return (
    <div id="time_selector">
      <h2>Hora</h2>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">--Selecciona la hora--</option>
        {times.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>
    </div>
  );
}

function RegisterAppointment() {
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const payload = JSON.parse(atob(token.split(".")[1])); // lectura de token para obtener nombre del usuario

  async function handleAppointment() {
    setError("");
    // checkeo de campos incompletos antes de enviar datos
    if (!doctor || !payload.user || !date || !time) {
      return setError("No pueden quedar campos vacíos.");
    }

    try {
      const res = await fetch("/api/create-appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // envío token para revisar si es válido
        },
        // enviar datos al server.js a traves de req.body
        body: JSON.stringify({
          doctor,
          patient: payload.user,
          date,
          time,
          status: "pendiente",
        }),
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
      <div id="header">
        <h1>Pedir un turno</h1>
      </div>
      <div id="content">
        <div id="form">
          <DoctorSelection value={doctor} onChange={setDoctor} />
          <DateSelection value={date} onChange={setDate} />
          <TimeSelection value={time} onChange={setTime} />
          <button onClick={handleAppointment} id="confirm_button">
            Confirmar y pedir
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
        <button onClick={() => navigate("/")}>Volver</button>
      </div>
    </div>
  );
}

export default RegisterAppointment;
