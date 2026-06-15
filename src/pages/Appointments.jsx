import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { capitalizeWords } from "../../utils/stringManipulation";
import isologo from '../assets/isologo.png';
import bgImage from '../assets/pexels-ivan-s.jpg';

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterSpecialty, setFilterSpecialty] = useState("todas");
  const [filterDoctor, setFilterDoctor] = useState("todos");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  async function handleUpdate(appointmentId) {
    const confirmed = window.confirm(
      "¿Seguro que querés cancelar el turno?",
    );
    if (!confirmed) return;

    setError("");
    try {
      const res = await fetch("/api/update-appointment", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: appointmentId, status: "cancelado" }),
      });

      const data = await res.json();
      if (!res.ok) return setError(data.message);
      navigate("/");
    } catch (error) {
      setError(`Error al cancelar turno: ${error}`);
    }
  }

  useEffect(() => {
    if (!token) return;
    fetch("/api/appointments", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAppointments(data);
      })
      .catch(() => console.error("Error al obtener turnos"));
  }, [token]);

  const doctors = [
    ...new Set(appointments.map((appointment) => appointment.doctor.name)),
  ];

  const specialties = [
    ...new Set(appointments.map((appointment) => appointment.doctor.specialty)),
  ];

  const filtered = appointments
    .filter(
      (appointment) =>
        filterStatus === "todos" || appointment.status === filterStatus,
    )
    .filter(
      (appointment) =>
        filterSpecialty === "todas" ||
        appointment.doctor.specialty === filterSpecialty,
    )
    .filter(
      (appointment) =>
        filterDoctor === "todos" || appointment.doctor.name === filterDoctor,
    );

  return (
    <div>
      <div id="header">
        <h1>Mis turnos</h1>
        <img id="isologo" src={isologo} alt="Isologo" />
      </div>
      <div id="content">
        <button onClick={() => navigate("/")}>Volver</button>
        <select
          value={filterStatus}
          onChange={(event) => setFilterStatus(event.target.value)}
        >
          <option value="todos">Todos los estados</option>
          <option value="pendiente">Pendientes</option>
          <option value="cancelado">Cancelados</option>
          <option value="revisado">Revisados</option>
        </select>
        <select
          value={filterSpecialty}
          onChange={(event) => setFilterSpecialty(event.target.value)}
        >
          <option value="todas">Todas las especialidades</option>
          {specialties.map((specialty) => (
            <option key={specialty} value={specialty}>
              {capitalizeWords(specialty)}
            </option>
          ))}
        </select>
        <select
          value={filterDoctor}
          onChange={(e) => setFilterDoctor(e.target.value)}
        >
          <option value="todos">Todos los profesionales</option>
          {doctors.map((doctor) => (
            <option key={doctor} value={doctor}>
              {capitalizeWords(doctor)}
            </option>
          ))}
        </select>
        <div id="cards_grid">
          {error && <p style={{ color: "red" }}>{error}</p>}
          {filtered.length === 0 ? (
            <p>No hay turnos.</p>
          ) : (
            filtered.map((appointment) => (
              <div key={appointment._id} className="appointment_card">
                <p>Doctor: {capitalizeWords(appointment.doctor.name)}</p>
                <p>
                  Especialidad: {capitalizeWords(appointment.doctor.specialty)}
                </p>
                <p>
                  Fecha: {appointment.date} a las {appointment.time}
                </p>
                <p>Estado: {capitalizeWords(appointment.status)}</p>
                {appointment.status === "pendiente" && (
                  <button onClick={() => handleUpdate(appointment._id)}>
                    Cancelar turno
                  </button>
                )}
              </div>
            ))
          )}
        </div>
        <img id="bg_image" src={bgImage} alt="" />
      </div>
    </div>
  );
}

export default Appointments;
