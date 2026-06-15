import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function DoctorPanel() {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("todos");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    fetch("/api/doctor/appointments", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAppointments(data);
      })
      .catch(() => console.error("Error al obtener turnos"));
  }, [token]);

  const filtered = filter === "todos"
    ? appointments
    : appointments.filter((apt) => apt.status === filter);

  return (
    <div>
      <div id="header">
        <h1>Turnos de mis pacientes</h1>
      </div>
      <div id="content">
        <button onClick={() => navigate("/")}>Volver</button>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="todos">Todos los estados</option>
          <option value="pendiente">Pendientes</option>
          <option value="cancelado">Cancelados</option>
          <option value="revisado">Revisados</option>
        </select>
        <div id="cards_grid">
          {filtered.length === 0 ? (
            <p>No hay turnos.</p>
          ) : (
            filtered.map((apt) => (
              <div key={apt._id} className="appointment_card">
                <p>Paciente: {apt.patient}</p>
                <p>Fecha: {apt.date} a las {apt.time}</p>
                <p>Estado: {apt.status}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorPanel;