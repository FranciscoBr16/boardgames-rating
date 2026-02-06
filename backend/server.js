const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/database');


const authRoutes = require('./routes/auth');
const juegosRoutes = require('./routes/juegos');
const puntuacionesRoutes = require('./routes/puntuaciones');

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'boardgames-rating-vercel2.vercel.app' 
  ],
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

app.get('/debug/usuarios', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id_usuario, nombre_usuario FROM usuarios');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});