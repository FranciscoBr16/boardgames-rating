import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerRanking, logout } from '../services/api';
import AnimatedBackground from './AnimatedBackground';
import './Ranking.css';

function Ranking() {
  const [ranking, setRanking] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    cargarRanking();
  }, []);

  const cargarRanking = async () => {
    try {
      setCargando(true);
      const data = await obtenerRanking();
      setRanking(data);
    } catch (err) {
      setError('Error al cargar el ranking');
      console.error(err);
    } finally {
      setCargando(false);
    }
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
          <p>Calculando el top de juegos...</p>
        </div>
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground>
      <div className="ranking-page">
        <header className="ranking-header">
          <button onClick={() => navigate('/')} className="btn-back">
            ← Volver
          </button>
          <h1>🏆 Top Board Games</h1>
          <nav className="header-nav">
            <button onClick={() => navigate('/perfil')} className="btn-nav">
              Mi Perfil
            </button>
            <button onClick={handleLogout} className="btn-nav">
              Salir
            </button>
          </nav>
        </header>

        <div className="ranking-list">
          {ranking.map((juego, index) => {
            const posicion = index + 1;
            const esTop5 = posicion <= 5;
            
            return (
              <div 
                key={juego.id_juego} 
                className={`ranking-item ${esTop5 ? 'top-5' : ''}`}
                style={{ '--bg-image': `url(${juego.imagen})` }}
              >
                <div className="item-background"></div>
                
                <div className="item-position">
                  <span>{posicion}</span>
                </div>

                <div className="item-info">
                  <div className="item-main">
                    <h2 className="item-name">{juego.nombre}</h2>
                    <p className="item-desc">{juego.descripcion?.substring(0, 100)}...</p>
                  </div>
                  
                  <div className="item-stats">
                    <div className="stat-box global">
                      <span className="stat-label">Promedio</span>
                      <span className="stat-value">{Number(juego.promedio).toFixed(1)}</span>
                    </div>
                    
                    {juego.mi_puntuacion && (
                      <div className="stat-box personal">
                        <span className="stat-label">Tu nota</span>
                        <span className="stat-value">{Number(juego.mi_puntuacion).toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {esTop5 && (
                  <div className="top-badge">
                    {posicion === 1 ? '🥇' : posicion === 2 ? '🥈' : posicion === 3 ? '🥉' : '✨'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AnimatedBackground>
  );
}

export default Ranking;
