import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAdminAuth } from '../context/AdminAuthContext';
import { 
    Shield, 
    Bell, 
    Key, 
    User, 
    LogOut, 
    Save, 
    Loader2
} from 'lucide-react';
import { toast } from 'react-toastify';

const SettingToggle = ({ title, description, active, onToggle }) => (
    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all">
        <div className="max-w-[80%]">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{title}</h4>
            <p className="text-[11px] text-slate-500 font-medium mt-1 uppercase tracking-widest">{description}</p>
        </div>
        <button 
            onClick={onToggle}
            className={`w-12 h-6 rounded-full relative transition-all duration-300 ${active ? 'bg-admin-primary' : 'bg-slate-200'}`}
        >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${active ? 'left-7' : 'left-1'}`} />
        </button>
    </div>
);

const AdminSettingsPage = () => {
    const { user } = useAdminAuth();
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        orderNotifications: true,
        bookingAlerts: true,
        emailReports: false,
        lowStockAlerts: true
    });

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            toast.success('Security settings updated');
        }, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h1>
                <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-widest">Manage your account and preferences</p>
            </div>

            <div className="grid grid-cols-1 gap-12">
                <div className="space-y-8">
                    {/* Security Section */}
                    <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-slate-900 rounded-xl text-white">
                                <Shield size={20} />
                            </div>
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Security & Access</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Current Password</label>
                                <div className="relative group">
                                    <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={18} />
                                    <input 
                                        type="password" 
                                        placeholder="••••••••••••"
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:border-slate-200 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">New Password</label>
                                    <input 
                                        type="password" 
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:border-slate-200 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Confirm New Password</label>
                                    <input 
                                        type="password" 
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:border-slate-200 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="pt-4">
                                <button 
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="w-full md:w-auto px-10 py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-slate-900/20"
                                >
                                    {saving ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> Save New Password</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettingsPage;
