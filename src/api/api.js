import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/", // Cambia la URL según tu backend
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
