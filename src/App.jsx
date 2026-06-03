import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateAppointment from "./pages/CreateAppointment";
import Appointments from "./pages/Appointments";
import RegisterDoctor from "./pages/RegisterDoctor";
import AdminPanel from "./pages/AdminPanel";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;
  return children;
}

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;
  const payload = JSON.parse(atob(token.split(".")[1]));
  if (payload.role !== "admin") return <Navigate to="/" />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/create-appointment"
          element={
            <PrivateRoute>
              <CreateAppointment />
            </PrivateRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <PrivateRoute>
              <Appointments />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/register-doctor"
          element={
            <AdminRoute>
              <RegisterDoctor />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/panel"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
