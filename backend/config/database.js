const { Pool } = require('pg');
require('dotenv').config();

console.log('Verificando conexión a base de datos...');
if (!process.env.DATABASE_URL) {
  console.error('ERROR: La variable DATABASE_URL no está definida en el entorno.');
} else {
  console.log('DATABASE_URL detectada correctamente.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Helper para mantener compatibilidad con el estilo de mysql2 si es posible
// Pero pg no devuelve [rows, fields], devuelve un objeto result.
// Vamos a exportar el pool directamente y ajustar las rutas.
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};