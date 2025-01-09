import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");

  // Verifica si el token existe
  if (!token) {
    console.log("No hay token");
    return <Navigate to="/" />;
  }

  // Verifica el rol del usuario si es necesario
  const userRole = localStorage.getItem("role");
  if (role && userRole !== role) {
    console.log(
      `Acceso denegado. Rol requerido: ${role}, rol actual: ${userRole}`
    );
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
