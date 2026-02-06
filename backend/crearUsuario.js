const bcrypt = require('bcrypt');
const db = require('./config/database');
require('dotenv').config();

async function crearUsuario(nombre_usuario, clave, nombre) {
  try {
    const claveHash = await bcrypt.hash(clave, 10);
    
    await db.query(
      'INSERT INTO usuarios (nombre_usuario, clave, nombre) VALUES (?, ?, ?)',
      [nombre_usuario, claveHash, nombre]
    );
    
    console.log(`✓ Usuario "${nombre_usuario}" creado exitosamente`);
  } catch (error) {
    console.error('Error al crear usuario:', error.message);
  } finally {
    process.exit(0);
  }
}

// Cambiar estos valores por los que quieras
const usuario = 'marti1';
const password = 'lapopular';
const nombreCompleto = 'Martina Ivars';

crearUsuario(usuario, password, nombreCompleto);