const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const juegosRoutes = require('./routes/juegos');
const puntuacionesRoutes = require('./routes/puntuaciones');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/images', express.static('public/images'));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/juegos', juegosRoutes);
app.use('/api/puntuaciones', puntuacionesRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});