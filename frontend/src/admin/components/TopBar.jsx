import React, { useState } from 'react';
import { Bell, Search, Menu, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const TopBar = ({ onToggleSidebar }) => {
    const { user, logout } = useAdminAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <header className="h-20 bg-admin-card border-b border-admin-border flex items-center justify-between px-6 md:px-10 sticky top-0 z-40 backdrop-blur-md bg-white/80">
            <div className="flex items-center gap-4 md:gap-8 flex-1">
                <button 
                    onClick={onToggleSidebar}
                    className="p-2.5 text-slate-600 hover:bg-slate-50 rounded-xl transition-all md:hidden border border-slate-200"
                >
                    <Menu size={20} />
                </button>

                <div className="relative w-full max-w-md hidden md:block group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-admin-primary transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search orders, menu, or customers..."
                        className="w-full pl-12 pr-6 py-2.5 bg-slate-50 border border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-admin-primary/20 focus:ring-4 focus:ring-admin-primary/5 transition-all outline-none"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4 md:gap-8">
                    <div className="relative">
                        <button 
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-3 p-1.5 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100"
                        >
                            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
                                {user?.fullName?.charAt(0) || 'A'}
                            </div>
                            <div className="text-left hidden sm:block pr-2">
                                <p className="text-sm font-black text-slate-900 leading-none">{user?.fullName || 'Admin User'}</p>
                            </div>
                            <ChevronDown size={14} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isProfileOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-3 w-64 bg-white border border-slate-100 rounded-3xl shadow-2xl shadow-slate-200/50 p-3 z-20"
                                    >
                                        <div className="px-4 py-3 border-b border-slate-50 mb-2">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Account</p>
                                            <p className="text-sm font-black text-slate-900 mt-1 truncate" title={user?.email || 'admin@tastybites.com'}>{user?.email || 'admin@tastybites.com'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <NavLink 
                                                to="settings" 
                                                className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all group"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-white border border-transparent group-hover:border-slate-100 transition-all">
                                                    <Settings size={16} />
                                                </div>
                                                Settings
                                            </NavLink>
                                            <NavLink 
                                                to="info" 
                                                className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all group"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-white border border-transparent group-hover:border-slate-100 transition-all">
                                                    <User size={16} />
                                                </div>
                                                Profile
                                            </NavLink>
                                            <button 
                                                onClick={() => { logout(); setIsProfileOpen(false); }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-all group"
                                            >
                                                <div className="p-2 bg-rose-50 rounded-lg group-hover:bg-white border border-transparent group-hover:border-rose-100 transition-all">
                                                    <LogOut size={16} />
                                                </div>
                                                Logout
                                            </button>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
            </div>
        </header>
    );
};

export default TopBar;
