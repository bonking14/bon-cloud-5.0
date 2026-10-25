import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { sesion, verificarVigencia } = useAuth();
  const location = useLocation();

  // Revisa la expiración del JWT en cada cambio de página
  useEffect(() => { verificarVigencia(); }, [location.pathname, verificarVigencia]);

  if (!sesion) return <Navigate to="/" replace state={{ desde: location.pathname }} />;
  return children;
}
