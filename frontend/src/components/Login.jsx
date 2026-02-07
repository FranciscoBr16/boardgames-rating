import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import AnimatedBackground from './AnimatedBackground';
import './Login.css';

function Login() {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      await login(nombreUsuario, clave);
      navigate('/juegos');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al iniciar sesión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <AnimatedBackground>
      <div className="login-container">
        <div className="login-card">
          <h1>🎲 Board Games Rating</h1>
          <p className="subtitle">Inicia sesión para darme tu opinion de mis jueguitos</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="usuario">Usuario</label>
              <input
                id="usuario"
                type="text"
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
                required
                placeholder="Ingresa tu usuario"
                disabled={cargando}
              />
            </div>

            <div className="form-group">
              <label htmlFor="clave">Contraseña</label>
              <input
                id="clave"
                type="password"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                required
                placeholder="Ingresa tu contraseña"
                disabled={cargando}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" disabled={cargando} className="btn-login">
              {cargando ? 'Cargando...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>
      </div>
    </AnimatedBackground>
  );
}

export default Login;