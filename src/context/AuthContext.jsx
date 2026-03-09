import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('tastybites_user');
        return saved ? JSON.parse(saved) : null;
    });
    const [token, setToken] = useState(() => localStorage.getItem('tastybites_token'));

    useEffect(() => {
        if (user) {
            localStorage.setItem('tastybites_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('tastybites_user');
        }
    }, [user]);

    useEffect(() => {
        if (token) {
            localStorage.setItem('tastybites_token', token);
        } else {
            localStorage.removeItem('tastybites_token');
        }
    }, [token]);

    // Initial cleanup: If we have a user but no token, clear the session
    useEffect(() => {
        if (user && !token) {
            logout();
        }
    }, []);

    // Refresh user data from backend on mount if token exists
    useEffect(() => {
        if (token) {
            api.getMe().then(data => {
                setUser(data);
            }).catch(() => {
                // Token expired or invalid
                logout();
            });
        }
    }, []);

    const login = async (email, password) => {
        try {
            const data = await api.login(email, password);
            if (data.success) {
                setToken(data.token);
                setUser(data.user);
                toast.success(`Welcome back, ${data.user.name || 'User'}!`);
                return { success: true };
            }
            toast.error(data.message || 'Login failed');
            return { success: false, message: 'Login failed' };
        } catch (err) {
            toast.error(err.message || 'Invalid email or password.');
            return { success: false, message: err.message || 'Invalid email or password.' };
        }
    };

    const signup = async (userData) => {
        try {
            const data = await api.signup(userData);
            if (data.success) {
                setToken(data.token);
                setUser(data.user);
                toast.success('Registration successful! Welcome to Tasty Bites.');
                return { success: true };
            }
            toast.error(data.message || 'Registration failed');
            return { success: false, message: 'Registration failed' };
        } catch (err) {
            toast.error(err.message || 'Registration failed. Please try again.');
            return { success: false, message: err.message || 'Registration failed. Please try again.' };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('tastybites_user');
        localStorage.removeItem('tastybites_token');
    };

    const updateProfile = async (updates) => {
        try {
            const data = await api.updateProfile(updates);
            if (data.success) {
                setUser(prev => ({ ...prev, ...data.user }));
                toast.success('Profile updated successfully!');
            }
        } catch (err) {
            console.error('Profile update error:', err);
            toast.error('Failed to update profile.');
            if (err.message.includes('token') || err.message.includes('401')) {
                logout();
            }
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, signup, logout, updateProfile, isAuthenticated: !!user && !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
