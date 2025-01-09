import React from "react";
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
  // Verifica si el usuario está autenticado
  const isAuthenticated = () => !!localStorage.getItem("token");

  // Obtiene el rol del usuario
  const getRole = () => localStorage.getItem("role");

  return (
    <Router>
      <Routes>
        {/* Ruta pública para Login */}
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              getRole() === "admin" ? (
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
            isAuthenticated() ? (
              getRole() === "admin" ? (
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
            isAuthenticated() && getRole() === "user" ? (
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
            isAuthenticated() && getRole() === "admin" ? (
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
