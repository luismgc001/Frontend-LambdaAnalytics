import React, { useState } from "react";
import api from "../api/api";

const EditUserForm = ({ user, onClose, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await api.put(`users/${user.id}/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Usuario actualizado correctamente.");
      onUserUpdated(response.data);
    } catch (err) {
      setError("No tienes permiso para editar este usuario.");
    }
  };

  return (
    <div className="edit-user-form">
      <h2>Editar Usuario</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Apellido</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Rol</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="admin">Administrador</option>
            <option value="user">Usuario</option>
          </select>
        </div>
        <button type="submit">Guardar</button>
        <button type="button" onClick={onClose}>
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default EditUserForm;
