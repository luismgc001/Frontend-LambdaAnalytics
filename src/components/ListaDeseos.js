import React from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import api from "../api/api";
import "../styles/ListaDeseos.css";

const ListaDeseos = ({ deseos, eliminarDeDeseos, setDeseos }) => {
  useEffect(() => {
    const obtenerDeseos = async () => {
      try {
        const response = await api.get("/lista-deseos/");
        console.log("LISTA DESEOS DATA", response.data);
        setDeseos(response.data);
      } catch (error) {
        console.error("Error al obtener la lista de deseos:", error);
      }
    };
    obtenerDeseos();
  }, [setDeseos]);

  return (
    <div className="lista-deseos">
      <h1>Lista de Deseos</h1>
      <Link to="/" className="link-dashboard">
        Volver al Dashboard
      </Link>
      <div className="lista-deseos-content">
        {deseos?.map((articulo) => (
          <div
            key={articulo.id}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <div className="articulo">
              <img src={articulo.imagen} alt={articulo.nombre} />
              <h3>{articulo.nombre}</h3>
              <p>Precio: {articulo.precio}</p>
              <a href={articulo.url} target="_blank" rel="noopener noreferrer">
                Ver en Mercado Libre
              </a>
              <button onClick={() => eliminarDeDeseos(articulo.id)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListaDeseos;
