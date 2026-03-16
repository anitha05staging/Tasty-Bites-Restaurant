import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Loader2 } from 'lucide-react';

const AdminProtectedRoute = ({ children }) => {
    const { user, loading } = useAdminAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-admin-brand-cream flex flex-col items-center justify-center p-6">
                <Loader2 className="animate-spin text-admin-primary mb-4" size={48} />
                <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Verifying Security Credentials...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default AdminProtectedRoute;
