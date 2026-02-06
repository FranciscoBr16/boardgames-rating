const express = require('express');
const db = require('../config/database');
const verificarToken = require('../middleware/auth');

const router = express.Router();

// Obtener puntuaciones del usuario
router.get('/usuario', verificarToken, async (req, res) => {
  try {
    const [puntuaciones] = await db.query(
      `SELECT p.*, j.nombre, j.descripcion 
       FROM puntuaciones p 
       JOIN juegos j ON p.id_juego = j.id_juego 
       WHERE p.id_usuario = ?`,
      [req.userId]
    );

    res.json(puntuaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener puntuaciones' });
  }
});

// Crear o actualizar puntuación
router.post('/', verificarToken, async (req, res) => {
  try {
    const { id_juego, puntuacion, estado } = req.body;

    const [existing] = await db.query(
      'SELECT * FROM puntuaciones WHERE id_juego = ? AND id_usuario = ?',
      [id_juego, req.userId]
    );

    if (existing.length > 0) {
      // Actualizar
      await db.query(
        'UPDATE puntuaciones SET puntuacion = ?, estado = ? WHERE id_juego = ? AND id_usuario = ?',
        [puntuacion, estado, id_juego, req.userId]
      );
    } else {
      // Insertar
      await db.query(
        'INSERT INTO puntuaciones (id_juego, id_usuario, puntuacion, estado) VALUES (?, ?, ?, ?)',
        [id_juego, req.userId, puntuacion, estado]
      );
    }

    res.json({ mensaje: 'Puntuación guardada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al guardar puntuación' });
  }
});

module.exports = router;