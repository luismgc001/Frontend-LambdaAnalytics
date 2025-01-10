import React, { useEffect, useState } from "react";
import Resultados from "./Resultados";
import ListaDeseos from "./ListaDeseos";
import api from "../api/api";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [role, setRole] = useState(null);
  const [articulos, setArticulos] = useState([]); // Estado para los artículos
  const [busqueda, setBusqueda] = useState(""); // Estado para la consulta de búsqueda
  const [cargando, setCargando] = useState(false);

   

  useEffect(() => {
    // Obtén el rol del usuario desde localStorage
    const userRole = localStorage.getItem("role");
    setRole(userRole);
  }, []);

  // Función para obtener artículos según la búsqueda
  const obtenerArticulos = async () => {
    if (!busqueda.trim()) {
      alert("Por favor ingresa un término de búsqueda.");
      return;
    }
    setCargando(true);

    try {
      const response = await api.get("search/", {
        params: { query: busqueda }, // Parámetros de consulta
      });
      
      
      const data = response.data;
      setArticulos(data); // Actualiza el estado con los resultados
      setCargando(false);
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al buscar los artículos.");
    }
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      {/* Input y botón de búsqueda */}
      {cargando && (<p>Cargando resultados...</p>)}
      {role === "user" && (
        <div className="busqueda-container">
          <input
            type="text"
            placeholder="Buscar artículos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)} // Actualiza el estado de búsqueda
          />
          <button onClick={obtenerArticulos}>Buscar</button>
        </div>
      )}

      {/* Mostrar componentes solo si el rol es "user" */}
      {role === "user" && (
        <>
          <Resultados articulos={articulos} />
          <ListaDeseos />
        </>
      )}

      {/* Mensaje para usuarios admin */}
      {role === "admin" && <p>Bienvenido al Dashboard de Administrador.</p>}
    </div>
  );
};

export default Dashboard;
