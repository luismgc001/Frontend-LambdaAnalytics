import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Para navegación
import api from "../api/api"; // Importa la instancia de Axios
import "../styles/Login.css"; // Importa los estilos

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Para redirigir

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("login/", { email, password });
      const { access, role } = response.data;
      localStorage.setItem("token", access);
      localStorage.setItem("role", role);
      alert("Inicio de sesión exitoso");
      setError("");
      console.log("ROL", role);
      console.log("Token", access);
      // Redirige basado en el rol
      if (role === "admin") {
        navigate("/admin"); // Página de administración
      } else {
        navigate("/dashboard"); // Página de usuario normal
      }
    } catch (err) {
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
