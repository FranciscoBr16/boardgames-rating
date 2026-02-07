import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerJuegos, guardarPuntuacion, getUsuarioActual, logout } from '../services/api';
import GameCard from './GameCard';
import AnimatedBackground from './AnimatedBackground';
import './GameSwiper.css';

function GameSwiper() {
  const [juegos, setJuegos] = useState([]);
  const [juegoActual, setJuegoActual] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [direccionAnimacion, setDireccionAnimacion] = useState('');
  const [animando, setAnimando] = useState(false);
  const navigate = useNavigate();
  const usuario = getUsuarioActual();

  useEffect(() => {
    cargarJuegos();
  }, []);

  const cargarJuegos = async () => {
    try {
      setCargando(true);
      const data = await obtenerJuegos();
      setJuegos(data);
    } catch (err) {
      setError('Error al cargar los juegos');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const handlePuntuar = async (id_juego, puntuacion, estado) => {
  try {
    await guardarPuntuacion(id_juego, puntuacion, estado);
    mostrarMensaje('✓ Puntuación guardada correctamente');
    
    setDireccionAnimacion('slide-out-left');
    setAnimando(true);
    
    setTimeout(() => {  // ← Cambiar de 400 a 600
      const nuevosJuegos = juegos.filter(j => j.id_juego !== id_juego);
      setJuegos(nuevosJuegos);
      
      if (juegoActual >= nuevosJuegos.length && nuevosJuegos.length > 0) {
        setJuegoActual(nuevosJuegos.length - 1);
      }
      
      setDireccionAnimacion('');
      setAnimando(false);
    }, 600);
  } catch (err) {
    setError('Error al guardar la puntuación');
    console.error(err);
  }
};

  const handleNoJugado = async (id_juego) => {
  try {
    await guardarPuntuacion(id_juego, null, 'no_jugado');
    mostrarMensaje('Juego marcado como no jugado');
    
    setDireccionAnimacion('slide-out-left');
    setAnimando(true);
    
    setTimeout(() => {  // ← Cambiar de 400 a 600
      const nuevosJuegos = juegos.filter(j => j.id_juego !== id_juego);
      setJuegos(nuevosJuegos);
      
      if (juegoActual >= nuevosJuegos.length && nuevosJuegos.length > 0) {
        setJuegoActual(nuevosJuegos.length - 1);
      }
      
      setDireccionAnimacion('');
      setAnimando(false);
    }, 600);
  } catch (err) {
    setError('Error al marcar el juego');
    console.error(err);
  }
};

 const siguienteJuego = () => {
  if (juegoActual < juegos.length - 1 && !animando) {
    setDireccionAnimacion('slide-out-left');
    setAnimando(true);
    
    setTimeout(() => {  // ← Cambiar de 400 a 600
      setJuegoActual(juegoActual + 1);
      setDireccionAnimacion('slide-in-right');
      
      setTimeout(() => {
        setDireccionAnimacion('');
        setAnimando(false);
      }, 50);
    }, 600);
  }
};

  const juegoAnterior = () => {
  if (juegoActual > 0 && !animando) {
    setDireccionAnimacion('slide-out-right');
    setAnimando(true);
    
    setTimeout(() => {  // ← Cambiar de 400 a 600
      setJuegoActual(juegoActual - 1);
      setDireccionAnimacion('slide-in-left');
      
      setTimeout(() => {
        setDireccionAnimacion('');
        setAnimando(false);
      }, 50);
    }, 600);
  }
};

  const mostrarMensaje = (msg) => {
    setMensaje(msg);
    setTimeout(() => setMensaje(''), 3000);
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
          <p>Cargando juegos...</p>
        </div>
      </AnimatedBackground>
    );
  }

  if (error) {
    return (
      <AnimatedBackground>
        <div className="error-container">
          <p>{error}</p>
          <button onClick={cargarJuegos}>Reintentar</button>
        </div>
      </AnimatedBackground>
    );
  }

  if (juegos.length === 0) {
    return (
      <AnimatedBackground>
        <div className="empty-container">
          <div className="empty-card">
            <h2>🎉 ¡Felicidades!</h2>
            <p>Has calificado todos los juegos disponibles, se que fueron muchos 😅</p>
            <button onClick={() => navigate('/perfil')} className="btn-primary">
              Ver mi perfil
            </button>
          </div>
        </div>
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground>
      <div className="swiper-container">
        {/* Header */}
        <header className="swiper-header">
          <div className="user-info">
            <span>👤 {usuario?.nombre}</span>
          </div>
          <h1>🎲 Califica los Juegos</h1>
          <nav className="header-nav">
            <button onClick={() => navigate('/perfil')} className="btn-nav">
              Mi Perfil
            </button>
            <button onClick={handleLogout} className="btn-nav">
              Salir
            </button>
          </nav>
        </header>

        {/* Mensaje de confirmación */}
        {mensaje && (
          <div className="mensaje-flotante">
            {mensaje}
          </div>
        )}

        {/* Contador de progreso */}
        <div className="progress-bar">
          <div className="progress-info">
            Juego {juegoActual + 1} de {juegos.length}
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${((juegoActual + 1) / juegos.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Tarjeta del juego con animación */}
        <div className="game-container">
          <div className={`game-card-wrapper ${direccionAnimacion}`}>
            <GameCard
              key={juegos[juegoActual].id_juego}
              juego={juegos[juegoActual]}
              onPuntuar={handlePuntuar}
              onNoJugado={handleNoJugado}
            />
          </div>
        </div>

        {/* Controles de navegación */}
        <div className="navigation-controls">
          <button
            onClick={juegoAnterior}
            disabled={juegoActual === 0 || animando}
            className="btn-control"
          >
            ← Anterior
          </button>
          <button
            onClick={siguienteJuego}
            disabled={juegoActual === juegos.length - 1 || animando}
            className="btn-control"
          >
            Siguiente →
          </button>
        </div>
      </div>
    </AnimatedBackground>
  );
}

export default GameSwiper;