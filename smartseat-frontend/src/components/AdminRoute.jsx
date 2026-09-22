import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';

function AdminRoute() {
    const { isAuthenticated, isAdmin } = useAuth();
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}

export default AdminRoute;
