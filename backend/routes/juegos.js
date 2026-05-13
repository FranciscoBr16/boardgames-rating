const express = require('express');
const db = require('../config/database');
const verificarToken = require('../middleware/auth');

const router = express.Router();

// Obtener todos los juegos SIN puntuar por el usuario actual
router.get('/', verificarToken, async (req, res) => {
  try {
    // Obtener juegos que NO han sido puntuados por este usuario
    const { rows: juegos } = await db.query(
      `SELECT j.* 
       FROM juegos j
       WHERE j.id_juego NOT IN (
         SELECT id_juego 
         FROM puntuaciones 
         WHERE id_usuario = $1
       )`,
      [req.userId]
    );
    
    // Agregar imágenes a cada juego
    for (let juego of juegos) {
      const { rows: imagenes } = await db.query(
        'SELECT imagen FROM imagenes_juegos WHERE id_juego = $1',
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
    const { rows: juegos } = await db.query(
      'SELECT * FROM juegos WHERE id_juego = $1',
      [req.params.id]
    );

    if (juegos.length === 0) {
      return res.status(404).json({ mensaje: 'Juego no encontrado' });
    }

    const juego = juegos[0];
    
    const { rows: imagenes } = await db.query(
      'SELECT imagen FROM imagenes_juegos WHERE id_juego = $1',
      [juego.id_juego]
    );
    
    juego.imagenes = imagenes.map(img => img.imagen);

    res.json(juego);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener juego' });
  }
});

// Obtener el ranking de juegos
router.get('/ranking', verificarToken, async (req, res) => {
  try {
    const { rows: ranking } = await db.query(
      `SELECT 
          j.id_juego, 
          j.nombre,
          j.descripcion,
          (SELECT AVG(puntuacion) FROM puntuaciones WHERE id_juego = j.id_juego AND estado = 'jugado') as promedio,
          (SELECT imagen FROM imagenes_juegos WHERE id_juego = j.id_juego LIMIT 1) as imagen,
          (SELECT puntuacion FROM puntuaciones WHERE id_juego = j.id_juego AND id_usuario = $1 LIMIT 1) as mi_puntuacion
       FROM juegos j
       WHERE EXISTS (
         SELECT 1 FROM puntuaciones WHERE id_juego = j.id_juego AND estado = 'jugado'
       )
       ORDER BY promedio DESC`,
      [req.userId]
    );

    res.json(ranking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el ranking' });
  }
});

module.exports = router;