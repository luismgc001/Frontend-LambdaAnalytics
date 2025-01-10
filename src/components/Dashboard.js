import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Resultados from "./Resultados";
import api from "../api/api";
import "../styles/Dashboard.css";

const Dashboard = ({ deseos, setDeseos }) => {
  const [role, setRole] = useState(null);
  const [articulos, setArticulos] = useState(null); // Datos originales (raw_data)
  const [recomendaciones, setRecomendaciones] = useState(null); // Datos transformados (transformed_data)
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(false);

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
      console.log("DATA", data);
      setArticulos(data.raw_data); // Guarda los datos sin transformar
      setRecomendaciones(data.transformed_data); // Guarda los datos transformados
      setCargando(false);
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al buscar los artículos.");
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

  return (
    <div className="dashboard">
      <h1>Buscar en Mercado Libre</h1>

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
          <Link to="/lista-deseos" className="link-deseos">
            Ver Lista de Deseos
          </Link>
        </div>
      )}

      {role === "user" && (
        <div className="dashboard-content">
          {/* Recomendaciones*/}
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
                  <button onClick={() => agregarADeseos(recomendaciones.ArticuloPrecioBajo)}>
                    Agregar a lista de deseos
                  </button>
                </div>

                {/* Producto mejor calificado */}
                <div className="articulo-recomendado">
                  <h3>Producto mejor calificado</h3>
                  <img
                    src={recomendaciones.ArticuloMejorCalificacion.imagen}
                    alt={recomendaciones.ArticuloMejorCalificacion.nombre}
                  />
                  <h4>{recomendaciones.ArticuloMejorCalificacion.nombre}</h4>
                  <p>{recomendaciones.ArticuloMejorCalificacion.precio}</p>
                  <button
                    onClick={() => agregarADeseos(recomendaciones.ArticuloMejorCalificacion)}
                  >
                    Agregar a lista de deseos
                  </button>
                </div>

                {/* Producto con mejor descuento */}
                <div className="articulo-recomendado">
                  <h3>Producto con mejor descuento</h3>
                  <img
                    src={recomendaciones.ArticuloDescuentoAlto.imagen}
                    alt={recomendaciones.ArticuloDescuentoAlto.nombre}
                  />
                  <h4>{recomendaciones.ArticuloDescuentoAlto.nombre}</h4>
                  <p>{recomendaciones.ArticuloDescuentoAlto.precio}</p>
                  <button onClick={() => agregarADeseos(recomendaciones.ArticuloDescuentoAlto)}>
                    Agregar a lista de deseos
                  </button>
                </div>

                {/* Producto con precio más alto */}
                <div className="articulo-recomendado">
                  <h3>Producto con precio más alto</h3>
                  <img
                    src={recomendaciones.ArticuloPrecioAlto.imagen}
                    alt={recomendaciones.ArticuloPrecioAlto.nombre}
                  />
                  <h4>{recomendaciones.ArticuloPrecioAlto.nombre}</h4>
                  <p>{recomendaciones.ArticuloPrecioAlto.precio}</p>
                  <button onClick={() => agregarADeseos(recomendaciones.ArticuloPrecioAlto)}>
                    Agregar a lista de deseos
                  </button>
                </div>

                {/* Precio promedio */}
                <div className="precio-promedio">
                  <h3>Precio Promedio</h3>
                  <p>
                    <strong>${recomendaciones.PrecioPromedio.toLocaleString("es-CO")}</strong>
                  </p>
                </div>
              </div>
              </div>
            )}
          

          {/* Resultados de búsqueda */}
          {articulos && (
            <div className="tabla-resultados">
            <h2>Resultados de búsqueda</h2>
            <Resultados articulos={articulos} agregarADeseos={agregarADeseos} />
          </div>
          )}
          
        </div>
      )}
    </div>
  );
};

export default Dashboard;
