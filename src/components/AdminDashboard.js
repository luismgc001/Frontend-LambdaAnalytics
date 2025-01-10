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

        if (!token) {
          window.location.href = "/";
          // navigate("/", { replace: true }); Metodo no funciona correctamente
          return;
        }

        const authResponse = await api.get("me/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAuthenticatedUser(authResponse.data);

        const usersResponse = await api.get("users/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Muestra todos los usuarios (activos e inactivos)
        setUsers(usersResponse.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          window.location.href = "/";
          // navigate("/", { replace: true });Metodo no funciona correctamente
        } else {
          setError("No tienes permiso para ver esta información.");
        }
      }
    };

    fetchUsers();
  }, [navigate]);

  const deactivateUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`users/${userId}/deactivate/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Usuario desactivado correctamente.");

      // Actualizar el estado local
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, is_active: false } : user
        )
      );
    } catch (err) {
      setError("No tienes permiso para desactivar usuarios.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Elimina el token
    localStorage.removeItem("role"); // Opcional: Elimina también el rol
    window.location.href = "/";
    // navigate("/");Metodo no funciona correctamente
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
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className={!user.is_active ? "inactive-user" : ""}
                >
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  <td>{user.first_name}</td>
                  <td>{user.last_name}</td>
                  <td>{user.role}</td>
                  {/* Mostrar el estado del usuario */}
                  <td>
                    {user.is_active ? (
                      <span className="active-indicator">Activo</span>
                    ) : (
                      <span className="inactive-indicator">Inactivo</span>
                    )}
                  </td>
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
                          !user.is_active ||
                          (authenticatedUser &&
                            authenticatedUser.id === user.id)
                        }
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
