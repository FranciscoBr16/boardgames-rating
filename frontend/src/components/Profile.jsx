import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerPuntuacionesUsuario, obtenerJuego, guardarPuntuacion, getUsuarioActual, logout } from '../services/api';
import AnimatedBackground from './AnimatedBackground';
import './Profile.css';

function Profile() {
  const [puntuaciones, setPuntuaciones] = useState([]);
  const [imagenesJuegos, setImagenesJuegos] = useState({});
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(null);
  const [nuevaPuntuacion, setNuevaPuntuacion] = useState('');
  const navigate = useNavigate();
  const usuario = getUsuarioActual();

  useEffect(() => {
    cargarPuntuaciones();
  }, []);

  const cargarPuntuaciones = async () => {
    try {
      setCargando(true);
      const data = await obtenerPuntuacionesUsuario();
      setPuntuaciones(data);
      
      // Cargar imágenes de cada juego
      const imagenes = {};
      for (const puntuacion of data) {
        try {
          const juego = await obtenerJuego(puntuacion.id_juego);
          if (juego.imagenes && juego.imagenes.length > 0) {
            imagenes[puntuacion.id_juego] = juego.imagenes[0]; // Primera imagen
          }
        } catch (err) {
          console.error(`Error al cargar imagen del juego ${puntuacion.id_juego}:`, err);
        }
      }
      setImagenesJuegos(imagenes);
    } catch (err) {
      console.error('Error al cargar puntuaciones:', err);
    } finally {
      setCargando(false);
    }
  };

  const handleEditar = (puntuacion) => {
    setEditando(puntuacion.id_juego);
    setNuevaPuntuacion(puntuacion.puntuacion?.toString() || '');
  };

  const handleGuardarEdicion = async (id_juego, estadoActual) => {
    try {
      const puntuacionNum = parseFloat(nuevaPuntuacion);
      
      if (isNaN(puntuacionNum) || puntuacionNum < 0 || puntuacionNum > 10) {
        alert('Por favor ingresa un número entre 0 y 10');
        return;
      }

      await guardarPuntuacion(id_juego, puntuacionNum, estadoActual);
      await cargarPuntuaciones();
      setEditando(null);
      setNuevaPuntuacion('');
    } catch (err) {
      console.error('Error al actualizar puntuación:', err);
    }
  };

  const handleCancelar = () => {
    setEditando(null);
    setNuevaPuntuacion('');
  };

  const calcularPromedio = () => {
    const jugados = puntuaciones.filter(p => p.estado === 'jugado' && p.puntuacion !== null);
    if (jugados.length === 0) return '0.00';
    const suma = jugados.reduce((acc, p) => acc + parseFloat(p.puntuacion), 0);
    return (suma / jugados.length).toFixed(2);
  };

  const obtenerJuegoFavorito = () => {
  const jugados = puntuaciones.filter(p => p.estado === 'jugado' && p.puntuacion !== null);
  if (jugados.length === 0) return null;
  
  // Encontrar el juego con la puntuación más alta
  const favorito = jugados.reduce((max, juego) => {
    return parseFloat(juego.puntuacion) > parseFloat(max.puntuacion) ? juego : max;
  });
  
  return favorito;
};

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (cargando) {
    return (
      <AnimatedBackground>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando tu perfil...</p>
        </div>
      </AnimatedBackground>
    );
  }

  const juegosJugados = puntuaciones.filter(p => p.estado === 'jugado');
  const juegosNoJugados = puntuaciones.filter(p => p.estado === 'no_jugado');

  return (
    <AnimatedBackground>
      <div className="profile-container">
        {/* Header */}
        <header className="profile-header">
          <div className="header-left">
            <div className="user-section">
              <h1>👤 Mi Perfil</h1>
              <p className="username">{usuario?.nombre}</p>
            </div>
            
            {/* Juego Favorito Compacto */}
            {obtenerJuegoFavorito() && (
              <div className="juego-favorito-compacto">
                <div className="favorito-label">⭐ JUEGO FAVORITO</div>
                <div 
                  className="favorito-mini-image"
                  style={{
                    backgroundImage: imagenesJuegos[obtenerJuegoFavorito().id_juego]
                      ? `url(${imagenesJuegos[obtenerJuegoFavorito().id_juego]})`
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                >
                  {!imagenesJuegos[obtenerJuegoFavorito().id_juego] && (
                    <div className="mini-placeholder">🎲</div>
                  )}
                  <div className="mini-overlay">
                    <div className="mini-nombre">{obtenerJuegoFavorito().nombre}</div>
                    <div className="mini-puntuacion">
                      {parseFloat(obtenerJuegoFavorito().puntuacion).toFixed(2)}/10
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <nav className="header-nav">
            <button onClick={() => navigate('/juegos')} className="btn-nav">
              Volver a Juegos
            </button>
            <button onClick={handleLogout} className="btn-nav">
              Salir
            </button>
          </nav>
        </header>

        {/* Estadísticas */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-number">{juegosJugados.length}</div>
            <div className="stat-label">Juegos Calificados</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{calcularPromedio()}</div>
            <div className="stat-label">Promedio General</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{juegosNoJugados.length}</div>
            <div className="stat-label">No Jugados</div>
          </div>
        </div>

       

        {/* Juegos Calificados */}
        {juegosJugados.length > 0 && (
          <div className="puntuaciones-container">
            <h2>🎮 Juegos Calificados</h2>
            <div className="puntuaciones-grid">
              {juegosJugados.map((puntuacion) => (
                <div 
                  key={puntuacion.id_juego} 
                  className="puntuacion-card"
                  style={{
                    backgroundImage: imagenesJuegos[puntuacion.id_juego] 
                      ? `url(${imagenesJuegos[puntuacion.id_juego]})` 
                      : 'none'
                  }}
                >
                  <div className="card-overlay"></div>
                  <div className="card-content">
                    <h3>{puntuacion.nombre}</h3>
                    <p className="game-description-short">{puntuacion.descripcion}</p>

                    {editando === puntuacion.id_juego ? (
                      <div className="edit-section">
                        <div className="input-group">
                          <label>Nueva puntuación (0.00 - 10.00):</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="10"
                            value={nuevaPuntuacion}
                            onChange={(e) => setNuevaPuntuacion(e.target.value)}
                            placeholder="Ej: 7.50"
                            className="puntuacion-input"
                          />
                        </div>
                        <div className="edit-actions">
                          <button
                            onClick={() => handleGuardarEdicion(puntuacion.id_juego, puntuacion.estado)}
                            className="btn-save"
                          >
                            Guardar
                          </button>
                          <button onClick={handleCancelar} className="btn-cancel">
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="puntuacion-display">
                        <div className="puntuacion-badge">
                          {parseFloat(puntuacion.puntuacion).toFixed(2)}/10
                        </div>
                        <button
                          onClick={() => handleEditar(puntuacion)}
                          className="btn-edit"
                        >
                          Editar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Juegos No Jugados */}
        {juegosNoJugados.length > 0 && (
          <div className="puntuaciones-container">
            <h2>⏸️ Juegos Marcados como No Jugados</h2>
            <div className="puntuaciones-grid">
              {juegosNoJugados.map((puntuacion) => (
                <div 
                  key={puntuacion.id_juego} 
                  className="puntuacion-card no-jugado"
                  style={{
                    backgroundImage: imagenesJuegos[puntuacion.id_juego] 
                      ? `url(${imagenesJuegos[puntuacion.id_juego]})` 
                      : 'none'
                  }}
                >
                  <div className="card-overlay"></div>
                  <div className="card-content">
                    <h3>{puntuacion.nombre}</h3>
                    <p className="game-description-short">{puntuacion.descripcion}</p>

                    {editando === puntuacion.id_juego ? (
                      <div className="edit-section">
                        <div className="input-group">
                          <label>Puntuación (0.00 - 10.00):</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="10"
                            value={nuevaPuntuacion}
                            onChange={(e) => setNuevaPuntuacion(e.target.value)}
                            placeholder="Ej: 7.50"
                            className="puntuacion-input"
                          />
                        </div>
                        <div className="edit-actions">
                          <button
                            onClick={() => handleGuardarEdicion(puntuacion.id_juego, 'jugado')}
                            className="btn-save"
                          >
                            Calificar
                          </button>
                          <button onClick={handleCancelar} className="btn-cancel">
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="puntuacion-display">
                        <div className="no-jugado-badge">Sin calificar</div>
                        <button
                          onClick={() => handleEditar(puntuacion)}
                          className="btn-edit"
                        >
                          Calificar ahora
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Estado vacío */}
        {puntuaciones.length === 0 && (
          <div className="empty-state">
            <div className="empty-card">
              <h2>📋 Sin calificaciones</h2>
              <p>Aún no has calificado ningún juego</p>
              <button onClick={() => navigate('/juegos')} className="btn-primary">
                Comenzar a Calificar
              </button>
            </div>
          </div>
        )}
      </div>
    </AnimatedBackground>
  );
}

export default Profile;