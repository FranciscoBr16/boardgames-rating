import { useState } from 'react';
import './GameCard.css';

function GameCard({ juego, onPuntuar, onNoJugado }) {
  const [imagenActual, setImagenActual] = useState(0);
  const [puntuacion, setPuntuacion] = useState('');
  const [guardando, setGuardando] = useState(false);

  const siguienteImagen = () => {
    if (juego.imagenes && juego.imagenes.length > 0) {
      setImagenActual((prev) => (prev + 1) % juego.imagenes.length);
    }
  };

  const imagenAnterior = () => {
    if (juego.imagenes && juego.imagenes.length > 0) {
      setImagenActual((prev) => (prev - 1 + juego.imagenes.length) % juego.imagenes.length);
    }
  };

  const handlePuntuar = async () => {
    const puntuacionNum = parseFloat(puntuacion);
    
    if (isNaN(puntuacionNum) || puntuacionNum < 0 || puntuacionNum > 10) {
      alert('Por favor ingresa un número entre 0 y 10');
      return;
    }

    setGuardando(true);
    await onPuntuar(juego.id_juego, puntuacionNum, 'jugado');
    setGuardando(false);
  };

  const handleNoJugado = async () => {
    setGuardando(true);
    await onNoJugado(juego.id_juego);
    setGuardando(false);
  };

  const setPuntuacionRapida = (valor) => {
    setPuntuacion(valor.toString());
  };

  return (
    <div className="game-card">
      <div className="game-card-inner">
        {/* Carrusel de imágenes */}
        <div className="image-carousel">
          {juego.imagenes && juego.imagenes.length > 0 ? (
            <>
              <img
                src={juego.imagenes[imagenActual]}
                alt={juego.nombre}
                className="game-image"
              />
              {juego.imagenes.length > 1 && (
                <>
                  <button className="carousel-btn prev" onClick={imagenAnterior}>
                    ‹
                  </button>
                  <button className="carousel-btn next" onClick={siguienteImagen}>
                    ›
                  </button>
                  <div className="image-indicators">
                    {juego.imagenes.map((_, idx) => (
                      <span
                        key={idx}
                        className={`indicator ${idx === imagenActual ? 'active' : ''}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="no-image">📷 Sin imagen</div>
          )}
        </div>

        {/* Información del juego */}
        <div className="game-info">
          <h2 className="game-title">{juego.nombre}</h2>
          <p className="game-meta">
            <strong>Editorial:</strong> {juego.editorial || 'N/A'}
          </p>
          <p className="game-meta">
            <strong>Jugadores:</strong> {juego.jugadores || 'N/A'}
          </p>
          <p className="game-description">{juego.descripcion || 'Sin descripción disponible'}</p>
        </div>

        {/* Sistema de puntuación */}
        <div className="rating-section">
          <h3>¿Cómo lo calificarías?</h3>
          
          {/* Botones rápidos */}
          <div className="rating-buttons-quick">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <button
                key={num}
                onClick={() => setPuntuacionRapida(num)}
                className={`rating-btn ${puntuacion === num.toString() ? 'selected' : ''}`}
                disabled={guardando}
              >
                {num}
              </button>
            ))}
          </div>

          {/* Input para puntuación decimal */}
          <div className="input-group">
            <label>O ingresa tu puntuación exacta (0.00 - 10.00):</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="10"
              value={puntuacion}
              onChange={(e) => setPuntuacion(e.target.value)}
              placeholder="Ej: 7.50"
              className="puntuacion-input-card"
              disabled={guardando}
            />
          </div>

          <button
            onClick={handlePuntuar}
            className="btn-puntuar"
            disabled={guardando || !puntuacion}
          >
            {guardando ? 'Guardando...' : 'Guardar Puntuación'}
          </button>

          <button
            onClick={handleNoJugado}
            className="btn-no-jugado"
            disabled={guardando}
          >
            {guardando ? 'Guardando...' : 'No lo he jugado'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameCard;