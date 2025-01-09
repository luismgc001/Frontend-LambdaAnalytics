import React, { useState } from 'react';
import api from '../api/api'; // Importa el archivo api.js

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await api.post('login/', { email, password });
            console.log('Token:', response.data.access);
            alert('Inicio de sesión exitoso');
        } catch (error) {
            console.error('Error en el inicio de sesión:', error);
            alert('Usuario o contraseña incorrectos');
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Iniciar sesión</button>
        </div>
    );
};

export default Login;
