import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import GameSwiper from './components/GameSwiper';
import Profile from './components/Profile';
import { getUsuarioActual } from './services/api';

// Componente para proteger rutas
function ProtectedRoute({ children }) {
  const usuario = getUsuarioActual();
  
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/juegos"
          element={
            <ProtectedRoute>
              <GameSwiper />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;