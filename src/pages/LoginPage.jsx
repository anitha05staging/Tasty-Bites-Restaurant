import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // If already authenticated, redirect to profile
    if (isAuthenticated) {
        navigate('/profile', { replace: true });
        return null;
    }

    const validateForm = () => {
        const newErrors = {};
        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const result = await login(email, password);
            setIsLoading(false);
            if (result.success) {
                navigate('/profile');
            } else {
                setError(result.message);
            }
        } catch (err) {
            setIsLoading(false);
            setError('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-brand-cream flex items-center justify-center pt-24 pb-12 px-6">
            <div className="w-full max-w-md">
                {/* Back Button */}
                <div className="flex items-center space-x-2 text-brand-text-light hover:text-primary transition-colors mb-8 cursor-pointer" onClick={() => navigate(-1)}>
                    <ArrowLeft size={18} />
                    <span>Back</span>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-100 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <div className="text-center mb-10 relative z-10">
                        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                            <Lock size={28} />
                        </div>
                        <h1 className="text-3xl font-playfair text-secondary mb-2">Sign In</h1>
                        <p className="text-gray-500 text-sm">Welcome back to Tasty Bites</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center space-x-3 bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100"
                        >
                            <AlertCircle size={18} />
                            <span className="text-sm font-medium">{error}</span>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full pl-12 pr-4 py-4 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary/50 bg-gray-50 focus:bg-white transition-all shadow-sm`}
                                    placeholder="Enter your email"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full pl-12 pr-12 py-4 rounded-xl border ${errors.password ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary/50 bg-gray-50 focus:bg-white transition-all shadow-sm`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors p-1"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full btn-primary py-4 rounded-xl text-lg flex items-center justify-center shadow-lg hover:shadow-primary/20 transition-all ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin flex-shrink-0 mr-3" />
                                    <span>Signing in...</span>
                                </>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-8 text-center relative z-10">
                        <p className="text-gray-500 text-sm">
                            Don't have an account?{' '}
                            <span
                                onClick={() => navigate('/signup')}
                                className="text-primary font-bold cursor-pointer hover:underline underline-offset-4"
                            >
                                Sign Up
                            </span>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginPage;
