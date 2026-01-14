import axios from 'axios';

// ¡IMPORTANTE! 
// Cada vez que abras los túneles, cambia esta URL por la del puerto 8000 que copiaste en el Paso 0.
// Ejemplo: "https://usuario-codespace-8000.app.github.dev"
const BASE_URL = "https://780q1m41-8000.use2.devtunnels.ms/"; 

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true // Importante para cookies/sesiones si las usas
});

// Interceptor opcional para incluir el token automáticamente en todas las peticiones
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;