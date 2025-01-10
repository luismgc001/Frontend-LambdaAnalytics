import React from "react";

const ListaDeseos = ({ deseos, eliminarDeDeseos }) => {
  return (
    <div className="lista-deseos">
      <h2>Lista de Deseos</h2>
      {deseos?.map((articulo) => (
        <div key={articulo.id} className="articulo">
          <img src={articulo.imagen} alt={articulo.nombre} />
          <h3>{articulo.nombre}</h3>
          <p>Precio: {articulo.precio}</p>
          <a href={articulo.url} target="_blank" rel="noopener noreferrer">Ver en Mercado Libre</a>
          <button onClick={() => eliminarDeDeseos(articulo.id)}>Eliminar</button>
        </div>
      ))}
    </div>
  );
};

export default ListaDeseos;
