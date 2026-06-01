import { useNavigate } from "react-router-dom";
import "../styles/style.css";

function Home() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }
  const payload = JSON.parse(atob(token.split(".")[1])); // lectura de token para obtener nombre del usuario

  function closeSession() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  function createAppointment() {
    navigate("/create-appointment");
  }

  function seeAppointments() {
    navigate("/appointments");
  }

  return (
    <div>
      <div id="header">
        <h1>Inicio</h1>
      </div>
      <div id="content">
        <h2>Bienvenido, {payload.user}</h2>
        <button onClick={closeSession}>Cerrar sesión</button>
        <button onClick={createAppointment}>Pedir turno</button>
        <button onClick={seeAppointments}>Mis turnos</button>
      </div>
    </div>
  );
}

export default Home;
