import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: `${API_URL}/api`,
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Funciones de autenticación
export const login = async (nombre_usuario, clave) => {
  const response = await api.post('/auth/login', { nombre_usuario, clave });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
};

export const getUsuarioActual = () => {
  const usuario = localStorage.getItem('usuario');
  return usuario ? JSON.parse(usuario) : null;
};

// Juegos
export const obtenerJuegos = async () => {
  const response = await api.get('/juegos');
  return response.data;
};

export const obtenerJuego = async (id) => {
  const response = await api.get(`/juegos/${id}`);
  return response.data;
};

// Puntuaciones
export const obtenerPuntuacionesUsuario = async () => {
  const response = await api.get('/puntuaciones/usuario');
  return response.data;
};

export const guardarPuntuacion = async (id_juego, puntuacion, estado) => {
  const response = await api.post('/puntuaciones', {
    id_juego,
    puntuacion,
    estado,
  });
  return response.data;
};

export default api;
