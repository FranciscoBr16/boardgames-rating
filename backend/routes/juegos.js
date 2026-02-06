const express = require('express');
const db = require('../config/database');
const verificarToken = require('../middleware/auth');

const router = express.Router();

// Obtener todos los juegos SIN puntuar por el usuario actual
router.get('/', verificarToken, async (req, res) => {
  try {
    // Obtener juegos que NO han sido puntuados por este usuario
    const [juegos] = await db.query(
      `SELECT j.* 
       FROM juegos j
       WHERE j.id_juego NOT IN (
         SELECT id_juego 
         FROM puntuaciones 
         WHERE id_usuario = ?
       )`,
      [req.userId]
    );
    
    // Agregar imágenes a cada juego
    for (let juego of juegos) {
      const [imagenes] = await db.query(
        'SELECT imagen FROM imagenes_juegos WHERE id_juego = ?',
        [juego.id_juego]
      );
      juego.imagenes = imagenes.map(img => img.imagen);
    }

    res.json(juegos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener juegos' });
  }
});

// Obtener un juego específico
router.get('/:id', verificarToken, async (req, res) => {
  try {
    const [juegos] = await db.query(
      'SELECT * FROM juegos WHERE id_juego = ?',
      [req.params.id]
    );

    if (juegos.length === 0) {
      return res.status(404).json({ mensaje: 'Juego no encontrado' });
    }

    const juego = juegos[0];
    
    const [imagenes] = await db.query(
      'SELECT imagen FROM imagenes_juegos WHERE id_juego = ?',
      [juego.id_juego]
    );
    
    juego.imagenes = imagenes.map(img => img.imagen);

    res.json(juego);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener juego' });
  }
});

module.exports = router;