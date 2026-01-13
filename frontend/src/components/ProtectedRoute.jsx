import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { checkAuth } from '../store/authSlice';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        // Check auth on mount if not already authenticated
        if (!isAuthenticated && !loading && !user) {
            dispatch(checkAuth());
        }
    }, [dispatch, isAuthenticated, loading, user]);

    // Show loading state while checking auth
    if (loading) {
        return (
            <div style={{
                minHeight: 'calc(100vh - 6rem)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <div style={{
                        width: '3rem',
                        height: '3rem',
                        border: '3px solid #e5e5e5',
                        borderTopColor: 'var(--color-brand-orange)',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <p style={{ color: '#71717a' }}>Loading...</p>
                </div>
                <style>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
