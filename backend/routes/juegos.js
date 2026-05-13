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

// Obtener el ranking de juegos
router.get('/ranking', verificarToken, async (req, res) => {
  try {
    const userId = req.userId;

    const { rows: ranking } = await db.query(
      `WITH PuntuacionesAgrupadas AS (
          SELECT 
              id_juego, 
              AVG(puntuacion) as promedio,
              COUNT(*) as total_votos
          FROM puntuaciones
          WHERE estado != 'no_jugado'
          GROUP BY id_juego
      )
      SELECT 
          j.id_juego, 
          j.nombre, 
          j.descripcion,
          pa.promedio,
          pa.total_votos,
          (SELECT imagen FROM imagenes_juegos WHERE id_juego = j.id_juego LIMIT 1) as imagen,
          up.puntuacion as mi_puntuacion,
          up.estado as mi_estado
      FROM juegos j
      LEFT JOIN PuntuacionesAgrupadas pa ON j.id_juego = pa.id_juego
      LEFT JOIN puntuaciones up ON j.id_juego = up.id_juego AND up.id_usuario = $1
      WHERE pa.promedio IS NOT NULL
      ORDER BY pa.promedio DESC`,
      [userId]
    );

    res.json(ranking);
  } catch (error) {
    console.error('Error detallado en ranking:', error);
    res.status(500).json({ mensaje: 'Error al obtener el ranking' });
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

module.exports = router;