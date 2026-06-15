import { useNavigate } from "react-router-dom";
import "../styles/style.css";
import { upperCaseFirstLetter } from "../../utils/stringManipulation";
import isologo from "../assets/isologo.png";
import bgImage from "../assets/pexels-matreding.jpg";

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
        <img id="isologo" src={isologo} alt="Isologo" />
      </div>
      {token ? (
        <div id="content">
          <h2>Bienvenido, {upperCaseFirstLetter(payload.user)}</h2>
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
          {payload.role === "doctor" && (
            <button onClick={() => navigate("/doctor/panel")}>
              Turnos de mis pacientes
            </button>
          )}
          <img id="bg_image" src={bgImage} alt="" />
        </div>
      ) : (
        <div id="content">
          <button onClick={() => navigate("/login")}>Iniciar sesión</button>
          <button onClick={() => navigate("/register")}>Registrarse</button>
          <img id="bg_image" src={bgImage} alt="" />
        </div>
      )}
    </div>
  );
}

export default Home;
