import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import EditUserForm from "./EditUserForm";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          var authResponse = await api.get("me/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }

        setAuthenticatedUser(authResponse.data);

        const usersResponse = await api.get("users/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

         // Filtrar solo los usuarios activos
         const activeUsers = usersResponse.data.filter((user) => user.is_active);
         setUsers(activeUsers);        
        console.log("USUARIOS: ", usersResponse.data)
      } catch (err) {
        if (err.response && err.response.status === 401) {
          navigate("/", { replace: true });
        } else {
          setError("No tienes permiso para ver esta información.");
        }
      }
    };

    fetchUsers();
  }, [navigate]);

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

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token"); // Elimina el token
    localStorage.removeItem("role"); // Opcional: Elimina también el rol
    window.location.href = "/"; // Redirige al login
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Administración de Usuarios</h1>
        <button className="logout-button" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>
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
        <div className="table-container">
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
                    <div className="actions">
                      <button
                        className="edit"
                        onClick={() => setEditingUser(user)}
                        disabled={
                          authenticatedUser && authenticatedUser.id === user.id
                        } // Deshabilitar si es el usuario autenticado
                      >
                        Editar
                      </button>
                      <button
                        className="deactivate"
                        onClick={() => deactivateUser(user.id)}
                        disabled={
                          authenticatedUser && authenticatedUser.id === user.id
                        } // Deshabilitar si es el usuario autenticado
                      >
                        Desactivar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
