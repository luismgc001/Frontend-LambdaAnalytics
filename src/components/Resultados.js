import React from "react";

const Resultados = ({ articulos, agregarADeseos }) => {
  return (
    <div className="resultados">
      {articulos.map((articulo, index) => (
        <div key={articulo.enlace || index} className="articulo">
          <img src={articulo.imagen} alt={articulo.nombre} />
          <h3>{articulo.nombre}</h3>
          <p>Precio: {articulo.precio}</p>
          <button onClick={() => agregarADeseos(articulo)}>Agregar a Lista de Deseos</button>
        </div>
      ))}
    </div>
  );
};

export default Resultados;
