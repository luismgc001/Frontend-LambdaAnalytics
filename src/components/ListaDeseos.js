import React from "react";
import { Link } from "react-router-dom";

const ListaDeseos = ({ deseos, eliminarDeDeseos }) => {
  return (
    <div className="lista-deseos">
      <h1>Lista de Deseos</h1>
      <Link to="/" className="link-dashboard">
        Volver al Dashboard
      </Link>
      <div className="lista-deseos-content">
        {deseos?.map((articulo) => (
          <div key={articulo.id} className="articulo">
            <img src={articulo.imagen} alt={articulo.nombre} />
            <h3>{articulo.nombre}</h3>
            <p>Precio: {articulo.precio}</p>
            <a href={articulo.url} target="_blank" rel="noopener noreferrer">
              Ver en Mercado Libre
            </a>
            <button onClick={() => eliminarDeDeseos(articulo.id)}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListaDeseos;
