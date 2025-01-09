import React, { useEffect, useState } from "react";
import api from "../api/api";
import EditUserForm from "./EditUserForm";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState("");

  // Cargar la lista de usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token enviado:", token);

        const response = await api.get("users/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Respuesta del backend:", response.data);
        setUsers(response.data);
      } catch (err) {
        console.error("Error del backend:", err.response);
        setError("No tienes permiso para ver esta información.");
      }
    };

    fetchUsers();
  }, []);

  // Función para desactivar un usuario
  const deactivateUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`users/${userId}/deactivate/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Usuario desactivado correctamente.");
      setUsers(users.filter((user) => user.id !== userId));
    } catch (err) {
      setError("No tienes permiso para desactivar usuarios.");
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Administración de Usuarios</h1>
      {error && <p className="error">{error}</p>}
      {editingUser ? (
        <EditUserForm
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onUserUpdated={(updatedUser) => {
            setUsers(
              users.map((user) =>
                user.id === updatedUser.id ? updatedUser : user
              )
            );
            setEditingUser(null);
          }}
        />
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  <td>{user.first_name}</td>
                  <td>{user.last_name}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => setEditingUser(user)}>Editar</button>
                    <button onClick={() => deactivateUser(user.id)}>
                      Desactivar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
