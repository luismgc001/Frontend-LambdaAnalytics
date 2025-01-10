import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import ListaDeseos from "./components/ListaDeseos";
import api from "./api/api";
import { jwtDecode } from "jwt-decode";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [deseos, setDeseos] = useState([]); // Estado para la lista de deseos

  // Verifica autenticación al cargar la aplicación
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos

        if (decodedToken.exp > currentTime) {
          setIsAuthenticated(true);
          setRole(userRole);
        } else {
          // Si el token ha caducado, eliminarlo
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          setIsAuthenticated(false);
          setRole(null);
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setIsAuthenticated(false);
        setRole(null);
      }
    }
  }, []);

  const eliminarDeDeseos = async (id) => {
    try {
      await api.delete(`/lista-deseos/${id}/`);
      setDeseos((prev) => prev.filter((articulo) => articulo.id !== id));
    } catch (error) {
      console.error("Error al eliminar el artículo:", error);
      alert("Ocurrió un error al eliminar el artículo de la lista de deseos.");
    }
  };

  return (
    <Router>
      <Routes>
        {/* Ruta pública para Login */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              role === "admin" ? (
                <Navigate to="/admin" />
              ) : (
                <Navigate to="/dashboard" />
              )
            ) : (
              <Login />
            )
          }
        />

        {/* Ruta pública para Registro */}
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              role === "admin" ? (
                <Navigate to="/admin" />
              ) : (
                <Navigate to="/dashboard" />
              )
            ) : (
              <Register />
            )
          }
        />

        {/* Ruta protegida para el Dashboard */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated && role === "user" ? (
              <Dashboard deseos={deseos} setDeseos={setDeseos} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Ruta protegida para el AdminDashboard */}
        <Route
          path="/admin"
          element={
            isAuthenticated && role === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Ruta para la Lista de Deseos */}
        <Route
          path="/lista-deseos"
          element={
            isAuthenticated && role === "user" ? (
              <ListaDeseos
                deseos={deseos}
                eliminarDeDeseos={eliminarDeDeseos}
                setDeseos={setDeseos}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
