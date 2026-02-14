import { useAuthStore } from '@/stores/useAuthStore';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export const ProtectedRoute = () => {
    const { isAuthenticated, token } = useAuthStore();
    const location = useLocation();

    if (!isAuthenticated || !token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};
