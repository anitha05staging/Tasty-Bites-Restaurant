import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminAuthApi } from '../services/adminApi';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('adminToken');
            if (token) {
                try {
                    const data = await adminAuthApi.verify();
                    if (data && data.role === 'admin') {
                        setUser(data);
                    } else {
                        localStorage.removeItem('adminToken');
                    }
                } catch (err) {
                    localStorage.removeItem('adminToken');
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        setError(null);
        try {
            const data = await adminAuthApi.login(email, password);
            if (!data || !data.user || data.user.role !== 'admin') {
                throw new Error('Access denied. Admin credentials required.');
            }
            localStorage.setItem('adminToken', data.token);
            setUser(data.user);
            return data.user;
        } catch (err) {
            setError(err.response?.data?.error || err.message);
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        setUser(null);
    };

    return (
        <AdminAuthContext.Provider value={{ user, login, logout, loading, error }}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
