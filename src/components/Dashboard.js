import React, { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  // Cargar información del usuario autenticado
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("me/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (err) {
        setError("No se pudo cargar la información del usuario.");
      }
    };

    fetchUser();
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/"; // Redirige al login
  };

  return (
    <div className="dashboard-container">
      <h1>Bienvenido al Dashboard</h1>
      {error && <p className="error">{error}</p>}
      {user ? (
        <div className="user-info">
          <p>
            <strong>Nombre:</strong> {user.first_name} {user.last_name}
          </p>
          <p>
            <strong>Correo Electrónico:</strong> {user.email}
          </p>
          <p>
            <strong>Teléfono:</strong> {user.phone}
          </p>
        </div>
      ) : (
        <p>Cargando información del usuario...</p>
      )}
      <button onClick={handleLogout} className="logout-button">
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Dashboard;
