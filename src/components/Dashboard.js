import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Resultados from "./Resultados";
import api from "../api/api";
import "../styles/Dashboard.css";

const Dashboard = ({ deseos, setDeseos }) => {
  const [role, setRole] = useState(null);
  const [articulos, setArticulos] = useState(null); // Datos originales (raw_data)
  const [recomendaciones, setRecomendaciones] = useState(null); // Datos transformados (transformed_data)
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setRole(userRole);
  }, []);

  const obtenerArticulos = async () => {
    if (!busqueda.trim()) {
      alert("Por favor ingresa un término de búsqueda.");
      return;
    }
    setCargando(true);

    try {
      const response = await api.get("search/", {
        params: { query: busqueda },
      });

      const data = response.data;
      setArticulos(data.raw_data); // Guarda los datos sin transformar
      setRecomendaciones(data.transformed_data); // Guarda los datos transformados
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al buscar los artículos.");
    } finally {
      setCargando(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      obtenerArticulos();
    }
  };

  const agregarADeseos = (articulo) => {
    setDeseos((prev) => [...prev, articulo]);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Elimina el token
    localStorage.removeItem("role"); // Opcional: Elimina también el rol
    window.location.href = "/";
  };

  return (
    <div className="dashboard">
      <div className="header-container">
        <h1>Buscar en Mercado Libre</h1>
        {role === "user" && (
          <button className="btn-cerrar-sesion" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        )}
      </div>

      {role === "user" && (
        <div className="busqueda-container">
          <input
            type="text"
            placeholder="Buscar artículos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onKeyDown={handleKeyDown} // Detecta la tecla Enter
          />
          <button onClick={obtenerArticulos}>Buscar</button>
          <button
            className="btn-lista-deseos"
            onClick={() => navigate("/lista-deseos")}
          >
            Lista de Deseos ({deseos.length})
          </button>
        </div>
      )}

      {/* Indicador de carga */}
      {cargando && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Buscando artículos...</p>
        </div>
      )}

      {role === "user" && !cargando && (
        <div className="dashboard-content">
          {/* Recomendaciones */}
          {recomendaciones && (
            <div className="recomendaciones">
              <h2>Recomendaciones:</h2>
              <div className="recomendaciones-list">
                {/* Producto con precio más bajo */}
                <div className="articulo-recomendado">
                  <h3>Producto con precio más bajo</h3>
                  <img
                    src={recomendaciones.ArticuloPrecioBajo.imagen}
                    alt={recomendaciones.ArticuloPrecioBajo.nombre}
                  />
                  <h4>{recomendaciones.ArticuloPrecioBajo.nombre}</h4>
                  <p>{recomendaciones.ArticuloPrecioBajo.precio}</p>
                  <button
                    onClick={() =>
                      agregarADeseos(recomendaciones.ArticuloPrecioBajo)
                    }
                  >
                    Agregar a lista de deseos
                  </button>
                </div>
                {/* Otros productos... */}
              </div>
            </div>
          )}

          {/* Resultados de búsqueda */}
          {articulos && (
            <div className="tabla-resultados">
              <h2>Resultados de búsqueda</h2>
              <Resultados
                articulos={articulos}
                agregarADeseos={agregarADeseos}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
