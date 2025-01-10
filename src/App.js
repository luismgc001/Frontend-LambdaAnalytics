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

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  // Verifica autenticación al cargar la aplicación
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (token) {
      setIsAuthenticated(true);
      setRole(userRole);
    }
  }, []);

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
              <Dashboard />
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
      </Routes>
    </Router>
  );
};

export default App;
