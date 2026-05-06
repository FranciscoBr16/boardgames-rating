-- Esquema para PostgreSQL

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
    clave VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Juegos
CREATE TABLE IF NOT EXISTS juegos (
    id_juego SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Imágenes de Juegos
CREATE TABLE IF NOT EXISTS imagenes_juegos (
    id_imagen SERIAL PRIMARY KEY,
    id_juego INTEGER REFERENCES juegos(id_juego) ON DELETE CASCADE,
    imagen TEXT NOT NULL -- URL o ruta de la imagen
);

-- Tabla de Puntuaciones
CREATE TABLE IF NOT EXISTS puntuaciones (
    id_puntuacion SERIAL PRIMARY KEY,
    id_juego INTEGER REFERENCES juegos(id_juego) ON DELETE CASCADE,
    id_usuario INTEGER REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    puntuacion INTEGER CHECK (puntuacion >= 0 AND puntuacion <= 10),
    estado VARCHAR(50), -- Ej: 'Completado', 'Pendiente', etc.
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_juego, id_usuario)
);
