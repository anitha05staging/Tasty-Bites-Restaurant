import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, Phone, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import PhoneInput from '../components/PhoneInput';

const SignupPage = () => {
    const { signup, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
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
        if (!name.trim()) newErrors.name = 'Full name is required';
        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (phone.length < 10) {
            newErrors.phone = 'Please enter a valid phone number';
        }
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
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
            const result = await signup({ name, email, phone, password });
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
                <div
                    className="flex items-center space-x-2 text-brand-text-light hover:text-primary transition-colors mb-8 cursor-pointer group"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
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
                            <User size={28} />
                        </div>
                        <h1 className="text-3xl font-playfair text-secondary mb-2">Create Account</h1>
                        <p className="text-gray-500 text-sm">Join Tasty Bites for a faster checkout experience</p>
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

                    <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <div className="relative">
                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`w-full pl-12 pr-4 py-4 rounded-xl border ${errors.name ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary/50 bg-gray-50 focus:bg-white transition-all shadow-sm`}
                                    placeholder="Enter your name"
                                />
                            </div>
                            {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
                        </div>

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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <div className={errors.phone ? 'ring-1 ring-red-500 rounded-xl overflow-hidden' : ''}>
                                <PhoneInput
                                    value={phone}
                                    onChange={(val) => setPhone(val)}
                                    placeholder="Enter phone number"
                                    className="shadow-sm rounded-xl overflow-hidden border border-gray-200"
                                    dropdownDirection="top"
                                />
                            </div>
                            {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>}
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
                                    placeholder="Create a password"
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
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center relative z-10">
                        <p className="text-gray-500 text-sm">
                            Already have an account?{' '}
                            <span
                                onClick={() => navigate('/login')}
                                className="text-primary font-bold cursor-pointer hover:underline underline-offset-4"
                            >
                                Sign In
                            </span>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SignupPage;
