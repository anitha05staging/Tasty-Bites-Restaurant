import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Mail, Lock, AlertCircle, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';

const AdminLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [localLoading, setLocalLoading] = useState(false);
    const { login, error } = useAdminAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/admin";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalLoading(true);
        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch (err) {
            console.error("Login failed:", err);
        } finally {
            setLocalLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-admin-brand-cream flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-admin-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-admin-accent/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-white rounded-[3rem] shadow-2xl shadow-admin-secondary/10 overflow-hidden border border-gray-100">
                    <div className="p-10">
                            <div className="flex flex-col items-center mb-10 text-center">
                                <div 
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-6 border border-emerald-500/20"
                                    style={{ backgroundColor: '#10b981' }}
                                >
                                    <ChefHat className="text-white" size={32} />
                                </div>
                            <h1 className="text-3xl font-playfair font-bold text-admin-secondary mb-2">Admin Portal</h1>
                            <p className="text-gray-500 font-medium font-poppins text-sm italic">Secure Restaurant Management</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <AnimatePresence mode="wait">
                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold"
                                    >
                                        <AlertCircle size={18} />
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 font-poppins">Staff Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-admin-primary transition-colors" size={20} />
                                    <input 
                                        type="email" 
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-admin-secondary placeholder:text-gray-400 focus:ring-2 focus:ring-admin-primary/20 transition-all outline-none font-medium text-base"
                                        placeholder="Enter Email"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 font-poppins">Access Password</label>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-admin-primary transition-colors" size={20} />
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-14 pr-14 py-4 bg-gray-50 border-none rounded-2xl text-admin-secondary placeholder:text-gray-400 focus:ring-2 focus:ring-admin-primary/20 transition-all outline-none font-medium text-base"
                                        placeholder="Enter Password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-admin-primary transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={localLoading}
                                className="w-full text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
                                style={{ backgroundColor: '#0f172a' }}
                            >
                                {localLoading ? (
                                    <Loader2 className="animate-spin" size={18} />
                                ) : (
                                    <>
                                        Login to Dashboard <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            Tasty Bites Administration • Precision Management System
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLoginPage;
