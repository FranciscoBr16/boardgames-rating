const { Pool } = require('pg');
require('dotenv').config();

// En PostgreSQL, la URL de conexión es la forma más común en hosting como Supabase/Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Requerido para muchos hosts gratuitos como Render/Supabase
  }
});

// Helper para mantener compatibilidad con el estilo de mysql2 si es posible
// Pero pg no devuelve [rows, fields], devuelve un objeto result.
// Vamos a exportar el pool directamente y ajustar las rutas.
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};