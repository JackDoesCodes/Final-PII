import { useNavigate } from "react-router-dom";
import "../styles/style.css";

function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;

  function closeSession() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div>
      <div id="header">
        <h1>Inicio</h1>
      </div>
      {token ? (
        <div id="content">
          <h2>Bienvenido, {payload.user}</h2>
          <button onClick={closeSession}>Cerrar sesión</button>
          <button onClick={() => navigate("/create-appointment")}>
            Pedir turno
          </button>
          <button onClick={() => navigate("/appointments")}>Mis turnos</button>
          {payload.role === "admin" && (
            <button onClick={() => navigate("/admin/panel")}>
              Panel de admin
            </button>
          )}
        </div>
      ) : (
        <div id="content">
          <button onClick={() => navigate("/login")}>Iniciar sesión</button>
          <button onClick={() => navigate("/register")}>Registrarse</button>
        </div>
      )}
    </div>
  );
}

export default Home;
