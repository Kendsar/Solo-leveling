import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0f1c]">
        <div className="text-cyan-400 animate-pulse font-mono tracking-widest uppercase">
          Initializing System...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to /auth and save the current location for redirection after login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0f1c]">
        <div className="text-cyan-400 animate-pulse font-mono tracking-widest uppercase">
          Initializing System...
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    // Already logged in, go to dashboard or previous location
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
};
