import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Redirigir si ya está autenticado
  useEffect(() => {
    setError("");
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      // Redirige basado en el rol
      
      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [navigate]); // Solo se ejecuta al montar el componente

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Realiza la solicitud al endpoint de login
      const response = await api.post("login/", { email, password });
      const { access, role } = response.data;

      // Almacena el token y el rol en localStorage
      localStorage.setItem("token", access);
      localStorage.setItem("role", role);

      // Limpia errores y redirige basado en el rol
      setError("");
      if (role === "admin") {
        navigate("/admin", { replace: true }); // Redirige a la página de administrador
      } else {
        navigate("/dashboard", { replace: true }); // Redirige a la página de usuario normal
      }
    } catch (err) {
      // Maneja errores de login
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn-login">
            Iniciar Sesión
          </button>
        </form>
        <p className="redirect-text">
          ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
