const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const db = require('./config/database');


const authRoutes = require('./routes/auth');
const juegosRoutes = require('./routes/juegos');
const puntuacionesRoutes = require('./routes/puntuaciones');

const app = express();

// Middleware
app.use(cors({
  origin: '*', 
  credentials: true
}));
app.use(express.json());

app.use('/images', express.static('public/images'));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/juegos', juegosRoutes);
app.use('/api/puntuaciones', puntuacionesRoutes);

app.get('/health/db', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Servir archivos estáticos del frontend (si están en public)
app.use(express.static(path.join(__dirname, 'public')));

// Manejar cualquier otra ruta devolviendo el index.html (SPA Fallback)
app.get('*', (req, res) => {
  // Solo aplicamos el fallback si no es una ruta de la API
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.status(404).json({ mensaje: 'Endpoint de API no encontrado' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});