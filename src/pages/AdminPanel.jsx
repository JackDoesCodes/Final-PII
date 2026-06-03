import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const [activeTable, setActiveTable] = useState("usuarios");
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingAppointmentId, setEditingAppointmentId] = useState(null);
  const [editUserData, setEditUserData] = useState({});
  const [editAppointmentData, setEditAppointmentData] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setUsers(data);
      })
      .catch(() => console.error("Error al obtener usuarios"));

    fetch("/api/admin/appointments", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAppointments(data);
      })
      .catch(() => console.error("Error al obtener turnos"));
  }, [token]);

  async function handleDeleteUser(id) {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return setError("Error al eliminar usuario");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch {
      setError("Error al conectar con el servidor");
    }
  }

  function handleEditUserStart(user) {
    setEditingUserId(user._id);
    setEditUserData({ user: user.user, role: user.role });
  }

  async function handleEditUserSave(id) {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editUserData),
      });
      const updated = await res.json();
      setUsers((prev) => prev.map((u) => (u._id === id ? updated : u)));
      setEditingUserId(null);
    } catch {
      setError("Error al actualizar usuario");
    }
  }

  async function handleDeleteAppointment(id) {
    if (!window.confirm("¿Eliminar este turno?")) return;
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return setError("Error al eliminar turno");
      setAppointments((prev) => prev.filter((a) => a._id !== id));
    } catch {
      setError("Error al conectar con el servidor");
    }
  }

  function handleEditAppointmentStart(appointment) {
    setEditingAppointmentId(appointment._id);
    setEditAppointmentData({
      patient: appointment.patient,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status,
    });
  }

  async function handleEditAppointmentSave(id) {
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editAppointmentData),
      });
      const updated = await res.json();
      setAppointments((prev) => prev.map((a) => (a._id === id ? updated : a)));
      setEditingAppointmentId(null);
    } catch {
      setError("Error al actualizar turno");
    }
  }

  return (
    <div>
      <div id="header">
        <h1>Panel de admin</h1>
      </div>
      <div id="content">
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button onClick={() => navigate("/")}>Volver</button>
        <select
          value={activeTable}
          onChange={(e) => setActiveTable(e.target.value)}
        >
          <option value="usuarios">Usuarios</option>
          <option value="turnos">Turnos</option>
        </select>
        <button onClick={() => navigate("/admin/register-doctor")}>
          Registrar doctor
        </button>
        {activeTable === "usuarios" && (
          <div id="users_table">
            <h2>Usuarios</h2>
            <table>
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    {editingUserId === user._id ? (
                      <>
                        <td>
                          <input
                            value={editUserData.user}
                            onChange={(e) =>
                              setEditUserData({
                                ...editUserData,
                                user: e.target.value,
                              })
                            }
                          />
                        </td>
                        <td>
                          <select
                            value={editUserData.role}
                            onChange={(e) =>
                              setEditUserData({
                                ...editUserData,
                                role: e.target.value,
                              })
                            }
                          >
                            <option value="patient">Paciente</option>
                            <option value="doctor">Doctor</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td>
                          <button onClick={() => handleEditUserSave(user._id)}>
                            Guardar
                          </button>
                          <button onClick={() => setEditingUserId(null)}>
                            Cancelar
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{user.user}</td>
                        <td>{user.role}</td>
                        <td>
                          <button
                            onClick={() => handleEditUserStart(user)}
                            style={{ backgroundColor: "#d9b85f" }}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            style={{ backgroundColor: "#D9775F" }}
                          >
                            Eliminar
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTable === "turnos" && (
          <div id="appointments_table">
            <h2>Turnos</h2>
            <table>
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Doctor</th>
                  <th>Especialidad</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment._id}>
                    {editingAppointmentId === appointment._id ? (
                      <>
                        <td>
                          <input
                            value={editAppointmentData.patient}
                            onChange={(e) =>
                              setEditAppointmentData({
                                ...editAppointmentData,
                                patient: e.target.value,
                              })
                            }
                          />
                        </td>
                        <td>{appointment.doctor.user}</td>
                        <td>{appointment.doctor.specialty}</td>
                        <td>
                          <input
                            type="date"
                            value={editAppointmentData.date}
                            onChange={(e) =>
                              setEditAppointmentData({
                                ...editAppointmentData,
                                date: e.target.value,
                              })
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="time"
                            value={editAppointmentData.time}
                            onChange={(e) =>
                              setEditAppointmentData({
                                ...editAppointmentData,
                                time: e.target.value,
                              })
                            }
                          />
                        </td>
                        <td>
                          <select
                            value={editAppointmentData.status}
                            onChange={(e) =>
                              setEditAppointmentData({
                                ...editAppointmentData,
                                status: e.target.value,
                              })
                            }
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="cancelado">Cancelado</option>
                            <option value="revisado">Revisado</option>
                          </select>
                        </td>
                        <td>
                          <button
                            onClick={() =>
                              handleEditAppointmentSave(appointment._id)
                            }
                          >
                            Guardar
                          </button>
                          <button onClick={() => setEditingAppointmentId(null)}>
                            Cancelar
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{appointment.patient}</td>
                        <td>{appointment.doctor.user}</td>
                        <td>{appointment.doctor.specialty}</td>
                        <td>{appointment.date}</td>
                        <td>{appointment.time}</td>
                        <td>{appointment.status}</td>
                        <td>
                          <button
                            onClick={() =>
                              handleEditAppointmentStart(appointment)
                            }
                            style={{ backgroundColor: "#d9b85f" }}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteAppointment(appointment._id)
                            }
                            style={{ backgroundColor: "#D9775F" }}
                          >
                            Eliminar
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
export default AdminPanel;
