import axios from 'axios';

// Configura Axios con la URL base de tu backend
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/', // Cambia esta URL según tu configuración
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
